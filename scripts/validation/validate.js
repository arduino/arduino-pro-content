const parser = require('node-html-parser');
const fileHelper = require('../lib/file-helper');
const fs = require('fs');
const yaml = require('js-yaml');
const validate = require('jsonschema').validate;
const path = require('path');
const tc = require('title-case');
const Validator = require('./domain/validator').Validator;
const { ValidationError } = require('./domain/validation-error');
const markdownLinkCheck = require('markdown-link-check');

const PARSER_SYNTAX_PREFIX = "language-"; // Prepended by marked
const CONFIG_PATH = "scripts/validation/config";
const basePathFromCommandline = process.argv[2];
const config = yaml.load(fs.readFileSync(`${CONFIG_PATH}/config-tutorials.yml`, 'utf8'));;
let tutorialPaths;
const debug = false; // Set this to true to debug the rule matching


if(basePathFromCommandline) {
    tutorialPaths = [basePathFromCommandline];
} else {
    tutorialPaths = fileHelper.getSubdirectories(config.basePath, config.excludePatterns);
}
const validator = new Validator(tutorialPaths);

debugPrint = (message) => {
    if(debug) console.log(message)
}

/**
 * Verify that all meta data is valid JSON and contains the correct attributes
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {
        let jsonData = tutorial.metadata;
        if(!jsonData) {
            const errorMessage = "No metadata found";
            errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));            
            return;
        }
    
        try {        
            if(!jsonData.coverImage){
                const errorMessage = "No cover image found";
                errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));                            
            } else if (jsonData.coverImage.indexOf(".svg") == -1) {
                const errorMessage = "Cover image is not in SVG format.";
                errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));                
            }
            
            let jsonSchema = JSON.parse(fs.readFileSync(config.metadataSchema));        
            let validationResult = validate(jsonData, jsonSchema);
            if(validationResult.errors.length != 0){
                const errorMessage = `An error occurred while validating the metadata ${validationResult}`;
                errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));                
            }        
    
        } catch (error) {
            const errorMessage = "An error occurred while parsing the metadata";
            errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));                       
        }
    });
    return errorsOccurred;
});

/**
 * Verifies that the titles are in the correct format
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {
       tutorial.headings.forEach(heading => {        
           if(tc.titleCase(heading) != heading){               
               const errorMessage = heading + "' is not title case";
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));               
           }
           if(heading.length > config.headingMaxLength){
               const errorMessage = heading + "' (" + heading.length + ") exceeds the max length (" + config.headingMaxLength + ")";
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));               
           }
       });
    });
    return errorsOccurred;
});


/**
 * Verify that SVG images don't contain embedded images
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {
        let svgFiles = tutorial.svgAssets;
        if(svgFiles === undefined || svgFiles.length == 0) return;
        svgFiles.forEach(path => {     
           const rawData = fs.readFileSync(path);
           if(rawData.includes("<image ")){
               const htmlDoc = parser.parse(rawData);
               let image = htmlDoc.querySelector("image")
               // Detect if there are embedded images that are actually rendered
               if(image.attributes.width || image.attributes.height){
                    const errorMessage = path + " contains embedded binary images.";
                    errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath, "warning"));                    
               }
           }
        });
    });
    return errorsOccurred;
});


/**
 * Verify that there are no broken links
 */
validator.addValidation(async (tutorials) => {
    if(!config.checkForBrokenLinks) return [];
    
    let promises = tutorials.map(tutorial => {
        return new Promise(function(resolve){
            const markdownContent = tutorial.markdown;
            if(!markdownContent) return;
            const ignorePatterns = config.brokenLinkExcludePatterns.map((ignorePattern) => {
                return {pattern : new RegExp(ignorePattern)}
            });
            const options = { ignorePatterns: ignorePatterns};
            markdownLinkCheck(markdownContent, options, function (err, results) {                
                if (err) {
                    console.error('Error', err);
                    return;
                }
                let errorsOccurred = [];
                results.forEach(function (result) {    
                    if(result.status == "alive" && config.verboseOutput){
                        debugPrint(`👍 ${result.link} is alive`);
                    } else if(result.status == "dead" && result.statusCode !== 0){
                        const errorMessage = `${result.link} is dead 💀 HTTP ${result.statusCode}`;
                        errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));                        
                    }
                });
                resolve(errorsOccurred);
            });
        });
    });

    return Promise.all(promises).then((results) => {
        return results.flat(1);
    });
});


/**
 * Verify that all files in the assets folder are referenced
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {    
        let imageNames = tutorial.imagePaths.map(imagePath => path.basename(imagePath));    
        let assetNames = tutorial.assets.map(asset => path.basename(asset));    
        let linkNames = tutorial.linkPaths.map(link => path.basename(link));        
        let coverImageName = tutorial.coverImagePath ? path.basename(tutorial.coverImagePath) : null;
    
        assetNames.forEach(asset => {        
            if(coverImageName == asset) return;
            if(!imageNames.includes(asset) && !linkNames.includes(asset)){        
               const errorMessage = asset + " is not used.";
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));                       
            }
        });
    });
    return errorsOccurred;
});


/**
 * Verify that the images exist and don't have an absolute path
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {
        tutorial.imagePaths.forEach(imagePath => {
            if(imagePath.startsWith("/") || imagePath.startsWith("~")){
               const errorMessage = "Image uses an absolute path: " + imagePath;
               const content = tutorial.markdown;
               const lineNumber = fileHelper.getLineNumberFromIndex(content.indexOf(imagePath), content);
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath, "error", lineNumber));               
            } else if(!imagePath.startsWith("http") && !fs.existsSync(`${tutorial.path}/${imagePath}`)){
                const errorMessage = "Image doesn't exist: " + imagePath;
                const content = tutorial.markdown;
                const lineNumber = fileHelper.getLineNumberFromIndex(content.indexOf(imagePath), content);
                errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath, "error", lineNumber));
            }
        });
    });
    return errorsOccurred;
});


/**
 * Ensures no nested lists are used
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    if(config.allowNestedLists) return errorsOccurred;
    tutorials.forEach(tutorial => {
        let nodes = tutorial.html.querySelectorAll("li ul");        
        if(nodes && nodes.length > 0){
            const errorMessage = "Content uses nested lists";
            errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));            
        }
    });
    return errorsOccurred;
});


/**
 * Verify that the images contain a description
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {
       tutorial.imageNodes.forEach(image => {            
           const imageDescription = image.attributes.alt;
           if(imageDescription.split(" ").length <= 1){
               const errorMessage = "Image doesn't have a description: " + image.attributes.src;
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));               
           }
       });
    });
    return errorsOccurred;
});


 /**
  * Verify that only allowed syntax specifiers are used
  */
 validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {         
        tutorial.codeNodes.forEach(codeNode => {
           let syntax = codeNode.classNames[0];
           if(syntax) syntax = syntax.replace(PARSER_SYNTAX_PREFIX, '');
           if(!config.allowedSyntaxSpecifiers.includes(syntax)){               
               const errorMessage = "Code block uses unsupported syntax: " + syntax;
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath));               
           }
        });
    });
    return errorsOccurred;
});

/**
 * Verifies that the content rules are met
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {
        let htmlContent = tutorial.rawHTML;
        let markdownContent = tutorial.markdown;
        let allRules = [];

        try {
            allRules.push(yaml.load(fs.readFileSync(`${CONFIG_PATH}/rules-spelling.yml`, 'utf8')));
            allRules.push(yaml.load(fs.readFileSync(`${CONFIG_PATH}/rules-trademarks.yml`, 'utf8')));
            allRules.push(yaml.load(fs.readFileSync(`${CONFIG_PATH}/rules-tutorials.yml`, 'utf8')));
        } catch (e) {
            console.log(e);
        }
        
        for(rules of allRules){
            for(rule of rules) {
                debugPrint(`🕵️ Validating rule ${rule.regex} for ${tutorial.contentFilePath}`)
                const content = rule.format == "html" ? htmlContent : markdownContent;
                const regex = new RegExp(rule.regex, "g");
                const matches = content.matchAll(regex);
                const ruleType = rule.type ?? "error";

                if(Array.from(matches).length == 0 && rule.shouldMatch){
                    const errorMessage = rule.errorMessage;
                    errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath, ruleType));
                } else {
                    debugPrint(`👍 Passed rule ${rule.regex} for ${tutorial.contentFilePath}`)
                }

                for(currentMatch of matches){
                    const index = currentMatch.index;
                    let lineNumber = fileHelper.getLineNumberFromIndex(index,content);                
        
                    if(!rule.shouldMatch) {
                        const errorMessage = rule.errorMessage;
                        errorsOccurred.push(new ValidationError(errorMessage, tutorial.contentFilePath, ruleType, lineNumber));
                    } else {
                        debugPrint(`👍 Passed rule ${rule.regex} for ${tutorial.contentFilePath}`)
                    }
                }

            };
        }
    
    });
    return errorsOccurred;
});

/**
 * Check if an error occurred and exit with the corresponding status code
 */
(function main() {
    console.log(`🕵️ Validating ${tutorialPaths.length} tutorials...`);
    validator.validate().then( validationIssues => {        
        if(validationIssues.length == 0){
            console.log("✅ No issues found.")
            process.exit(0);
        }

        let validationErrors = 0;
        let validationWarnings = 0;

        for(issue of validationIssues){
            if(issue.type == "error") {
                ++validationErrors;
            } else {
                ++validationWarnings;
            }
            const symbol = issue.type == "error" ? "❌" : "😬";                
            const lineNumber = issue.lineNumber ?  ":" + issue.lineNumber : "";
            console.log(symbol + " " + issue.message + " Location: " + issue.file + lineNumber);
        }
        
        if(validationWarnings > 0)
            console.log("😬 " + validationWarnings+ " warnings found.")
        if(validationErrors > 0)
            console.log("🚫 " + validationErrors + " errors found.")
        process.exit(validationErrors > 0 ? 2 : 0);
    });
})()