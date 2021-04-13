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
validator.addValidation((tutorials) => {
    let errorsOccurred = 0;
    tutorials.forEach(tutorial => {
        let jsonData = tutorial.metadata
        if(!jsonData) {
            console.log("❌ No metadata file found for tutorial " + tutorial.path);
            ++errorsOccurred;
            return;
        }
    
        try {        
            if(!jsonData.coverImage){
                console.log("❌ No cover image found for " + tutorial.path);
                ++errorsOccurred;            
            } else if (jsonData.coverImage.src.indexOf(".svg") == -1) {
                console.log("❌ Cover image of " + tutorial.path + " is not in SVG format.");
                ++errorsOccurred;
            }
            
            let jsonSchema = JSON.parse(fs.readFileSync(config.metadataSchema));        
            let validationResult = validate(jsonData, jsonSchema);
            if(validationResult.errors.length != 0){
                console.log("❌ An error occurred while validating the metadata of " + tutorial.path);
                console.log(validationResult);
                ++errorsOccurred;
            }        
    
        } catch (error) {
            console.log("❌ An error occurred while parsing the metadata of " + tutorial.path);        
            console.log(error);
            ++errorsOccurred;        
        }
    });
    return errorsOccurred;
});

/**
 * Verifies that the titles are in the correct format
 */
validator.addValidation((tutorials) => {
    let errorsOccurred = 0;
    tutorials.forEach(tutorial => {
       tutorial.headings.forEach(heading => {        
           if(tc.titleCase(heading) != heading){
               console.log("❌ '" + heading + "' is not title case in tutorial " + tutorial.path);
               ++errorsOccurred;
           }
           if(heading.length > config.headingMaxLength){
               console.log("❌ '" + heading + "' (" + heading.length + ") exceeds the max length (" + config.headingMaxLength + ") in tutorial " + tutorial.path);
               ++errorsOccurred;
           }
       });
    });
    return errorsOccurred;
});


/**
 * Verify that SVG images don't contain embedded images
 */
validator.addValidation((tutorials) => {
    let errorsOccurred = 0;
    tutorials.forEach(tutorial => {
        let svgFiles = tutorial.svgAssets;
        svgFiles.forEach(path => {     
           const rawData = fs.readFileSync(path);
           if(rawData.includes("<image ")){
               const htmlDoc = parser.parse(rawData);
               let image = htmlDoc.querySelector("image")
               // Detect if there are embedded images that are actually rendered
               if(image.attributes.width || image.attributes.height){
                   console.log("❌ " + path + " containes embedded binary images");
                   ++errorsOccurred;
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
    if(!config.checkForBrokenLinks) return 0;
    
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
                let errorsOccurred = 0;
                results.forEach(function (result) {    
                    if(result.status == "alive"){
                        console.log('✅ %s is alive', result.link);
                    } else if(result.status == "dead"){
                        ++errorsOccurred;
                        console.log('❌ %s is dead 💀 HTTP %s in %s', result.link, result.statusCode, tutorial.path);
                    }
                });
                resolve(errorsOccurred);
            });
        });
    });

    return Promise.all(promises).then((results) => {
        return results.reduce((a, b) => a + b, 0);
    });
});


/**
 * Verify that all files in the assets folder are referenced
 */
validator.addValidation((tutorials) => {
    let errorsOccurred = 0;
    tutorials.forEach(tutorial => {    
        let imageNames = tutorial.imagePaths.map(imagePath => path.basename(imagePath));    
        let assetNames = tutorial.assets.map(asset => path.basename(asset));    
        let linkNames = tutorial.linkPaths.map(link => path.basename(link));
        let coverImageName = path.basename(tutorial.coverImagePath);        
    
        assetNames.forEach(asset => {        
            if(coverImageName == asset) return;
            if(!imageNames.includes(asset) && !linkNames.includes(asset)){        
                console.log("❌ " + asset + " is not used in tutorial " + tutorial.path);
                ++errorsOccurred;        
            }
        });
    });
    return errorsOccurred;
});


/**
 * Verify that the images don't have an absolute path
 */
validator.addValidation((tutorials) => {
    let errorsOccurred = 0;
    tutorials.forEach(tutorial => {
        tutorial.imagePaths.forEach(imagePath => {
            if(imagePath.startsWith("/") || imagePath.startsWith("~")){
                console.log("❌ Image uses an absolute path: " + imagePath + " in " + tutorial.path);
                ++errorsOccurred;
            }
        });
    });
    return errorsOccurred;
});


/**
 * Ensures no nested lists are used
 */
validator.addValidation((tutorials) => {
    if(config.allowNestedLists) return;
    let errorsOccurred = 0;
    tutorials.forEach(tutorial => {
        let nodes = tutorial.html.querySelectorAll("li ul");        
        if(nodes && nodes.length > 0){
            ++errorsOccurred;
            console.log("❌ Content uses nested lists in " + tutorial.path);
        }
    });
    return errorsOccurred;
});


/**
 * Verify that the images contain a description
 */
validator.addValidation((tutorials) => {
    let errorsOccurred = 0;
    tutorials.forEach(tutorial => {
       tutorial.imageNodes.forEach(image => {            
           const imageDescription = image.attributes.alt;
           if(imageDescription.split(" ").length <= 1){
               console.log("❌ Image doesn't have a description: " + image.attributes.src + " in " + tutorial.path);
               ++errorsOccurred;
           }
       });
    });
    return errorsOccurred;
});


 /**
  * Verify that only allowed syntax specifiers are used
  */
 validator.addValidation((tutorials) => {
    let errorsOccurred = 0;
    tutorials.forEach(tutorial => {         
        tutorial.codeNodes.forEach(codeNode => {
           let syntax = codeNode.classNames[0];
           if(syntax) syntax = syntax.replace(PARSER_SYNTAX_PREFIX, '');
           if(!config.allowedSyntaxSpecifiers.includes(syntax)){
               console.log("❌ Code block uses unsupported syntax: " + syntax + " in " + tutorial.path);
               ++errorsOccurred;
           }
        });
    });
    return errorsOccurred;
});

/**
 * Verifies that the content rules are met
 */
validator.addValidation((tutorials) => {
    let errorsOccurred = 0;
    tutorials.forEach(tutorial => {
        let htmlContent = tutorial.rawHTML;
        let markdownContent = tutorial.markdown;
    
        rules.forEach(rule => {
            const content = rule.format == "html" ? htmlContent :markdownContent;
            const regex = new RegExp(rule.regex);
            const match = content.match(regex);
            let lineNumber = null;

            if(match){
                const index = match.index;
                lineNumber = fileHelper.getLineNumberFromIndex(index,content);                
            }
            if((match === null && rule.shouldMatch) || (match !== null && !rule.shouldMatch)) {
                const errorMessage = "❌ " + rule.errorMessage + " in " + tutorial.path + ":" + lineNumber;
                const error = new ValidationError(errorMessage,tutorial.path, lineNumber);
                console.log(error.message);
                ++errorsOccurred;
            }     
        });
    
    });
    return errorsOccurred;
});

/**
 * Check if an error occurred and exit with the corresponding status code
 */
(function main() {
    validator.validate().then( errorsFound => {        
        if(errorsFound == 0){
            console.log("✅ No errors found.")
            process.exit(0);
        } else {
            console.log("🚫 " + errorsFound + " errors found.")
            process.exit(2);
        }  
    });
})()