const parser = require('node-html-parser');
const fileHelper = require('../lib/file-helper');
const fs = require('fs');
const validate = require('jsonschema').validate;
const path = require('path');
const tc = require('title-case');
const config = require('./config/config-tutorials');
const rules = require('./config/rules-tutorials');
const Validator = require('./domain/validator').Validator;
const { ValidationError } = require('./domain/validation-error');
const markdownLinkCheck = require('markdown-link-check');


const PARSER_SYNTAX_PREFIX = "language-"; // Prepended by marked
const basePathFromCommandline = process.argv[2];
let tutorialPaths;

if(basePathFromCommandline) {
    tutorialPaths = [basePathFromCommandline];
} else {
    tutorialPaths = fileHelper.getSubdirectories(config.basePath, config.excludePatterns);
}
const validator = new Validator(tutorialPaths);


/**
 * Verify that all meta data files are valid JSON and contain the correct attributes
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {
        let jsonData = tutorial.metadata
        if(!jsonData) {
            const errorMessage = "No metadata file found";
            errorsOccurred.push(new ValidationError(errorMessage, tutorial.metadataPath));            
            return;
        }
    
        try {        
            if(!jsonData.coverImage){
                const errorMessage = "No cover image found";
                errorsOccurred.push(new ValidationError(errorMessage, tutorial.metadataPath));                            
            } else if (jsonData.coverImage.src.indexOf(".svg") == -1) {
                const errorMessage = "Cover image is not in SVG format.";
                errorsOccurred.push(new ValidationError(errorMessage, tutorial.metadataPath));                
            }
            
            let jsonSchema = JSON.parse(fs.readFileSync(config.metadataSchema));        
            let validationResult = validate(jsonData, jsonSchema);
            if(validationResult.errors.length != 0){
                const errorMessage = `An error occurred while validating the metadata ${validationResult}`;
                errorsOccurred.push(new ValidationError(errorMessage, tutorial.metadataPath));                
            }        
    
        } catch (error) {
            const errorMessage = "An error occurred while parsing the metadata";
            errorsOccurred.push(new ValidationError(errorMessage, tutorial.metadataPath));                       
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
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));               
           }
           if(heading.length > config.headingMaxLength){
               const errorMessage = heading + "' (" + heading.length + ") exceeds the max length (" + config.headingMaxLength + ")";
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));               
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
        svgFiles.forEach(path => {     
           const rawData = fs.readFileSync(path);
           if(rawData.includes("<image ")){
               const htmlDoc = parser.parse(rawData);
               let image = htmlDoc.querySelector("image")
               // Detect if there are embedded images that are actually rendered
               if(image.attributes.width || image.attributes.height){
                    const errorMessage = path + " containes embedded binary images";
                    errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));                    
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
                        console.log('✅ %s is alive', result.link);
                    } else if(result.status == "dead" && result.statusCode !== 0){
                        const errorMessage = `${result.link} is dead 💀 HTTP ${result.statusCode}`;
                        errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));                        
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
        let coverImageName = path.basename(tutorial.coverImagePath);        
    
        assetNames.forEach(asset => {        
            if(coverImageName == asset) return;
            if(!imageNames.includes(asset) && !linkNames.includes(asset)){        
               const errorMessage = asset + " is not used";
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));                       
            }
        });
    });
    return errorsOccurred;
});


/**
 * Verify that the images don't have an absolute path
 */
validator.addValidation(async (tutorials) => {
    let errorsOccurred = [];
    tutorials.forEach(tutorial => {
        tutorial.imagePaths.forEach(imagePath => {
            if(imagePath.startsWith("/") || imagePath.startsWith("~")){
               const errorMessage = "Image uses an absolute path: " + imagePath;
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));               
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
            errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));            
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
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));               
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
               errorsOccurred.push(new ValidationError(errorMessage, tutorial.path));               
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
    
        rules.forEach(rule => {
            const content = rule.format == "html" ? htmlContent : markdownContent;
            const regex = new RegExp(rule.regex);
            const match = content.match(regex);
            let lineNumber = null;

            if(match){
                const index = match.index;
                lineNumber = fileHelper.getLineNumberFromIndex(index,content);                
            }
            if((match === null && rule.shouldMatch) || (match !== null && !rule.shouldMatch)) {
                const errorMessage = rule.errorMessage;
                errorsOccurred.push(new ValidationError(errorMessage, tutorial.path, lineNumber));                
            }     
        });
    
    });
    return errorsOccurred;
});

/**
 * Check if an error occurred and exit with the corresponding status code
 */
(function main() {
    console.log(`🕵️ Validating ${tutorialPaths.length} tutorials...`);
    validator.validate().then( validationErrors => {        
        if(validationErrors.length == 0){
            console.log("✅ No errors found.")
            process.exit(0);
        } else {
            for(error of validationErrors){
                const lineNumber = error.lineNumber ?  ":" + error.lineNumber : "";
                console.log("❌ " + error.message + " Location: " + error.file + ":" + lineNumber);
            }
            console.log("🚫 " + validationErrors.length + " errors found.")
            process.exit(2);
        }  
    });
})()