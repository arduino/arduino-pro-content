const parser = require('node-html-parser');
const fs = require('fs');
const validate = require('jsonschema').validate;
const path = require('path');
const tc = require('title-case');
const config = require('./config');
const rules = require('./rules');
const Validator = require('./validator').Validator;

const PARSER_SYNTAX_PREFIX = "language-";
const validator = new Validator(config);


/**
 * Verify that all meta data files are valid JSON and contain the correct attributes
 */
validator.addValidation((tutorials) => {
    let errorOccurred = false;
    tutorials.forEach(tutorial => {
        let jsonData = tutorial.metadata
        if(!jsonData) {
            console.log("❌ No metadata file found for tutorial " + tutorial.path);
            errorOccurred = true;
        }
    
        try {        
            if(!jsonData.coverImage){
                console.log("❌ No cover image found for " + path);
                errorOccurred = true;            
            } else if (jsonData.coverImage.src.indexOf(".svg") == -1) {
                console.log("❌ Cover image of " + path + "is not in SVG format.");
                errorOccurred = true;
            }
            
            let jsonSchema = JSON.parse(fs.readFileSync("./metadata-schema.json"));        
            let validationResult = validate(jsonData, jsonSchema);
            if(validationResult.errors.length != 0){
                console.log(validationResult);
                errorOccurred = true;
            }        
    
        } catch (error) {        
            errorOccurred = true;        
        }
    });
    return errorOccurred;
});

/**
 * Verifies that the titles are in the correct format
 */
validator.addValidation((tutorials) => {
    let errorOccurred = false;
    tutorials.forEach(tutorial => {
       tutorial.headings.forEach(heading => {        
           if(tc.titleCase(heading) != heading){
               console.log("❌ '" + heading + "' is not title case in tutorial " + tutorial.path);
               errorOccurred = true;
           }
           if(heading.length > config.headingMaxLength){
               console.log("❌ '" + heading + "' (" + heading.length + ") exceeds the max length (" + config.headingMaxLength + ") in tutorial " + tutorial.path);
               errorOccurred = true;
           }
       });
    });
    return errorOccurred;
});


/**
 * Verify that SVG images don't contain embedded images
 */
validator.addValidation((tutorials) => {
    let errorOccurred = false;
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
                   errorOccurred = true;
               }
           }
        });
    });
    return errorOccurred;
});


/**
 * Verify that all files in the assets folder are referenced
 */
validator.addValidation((tutorials) => {
    let errorOccurred = false;
    tutorials.forEach(tutorial => {    
        let imageNames = tutorial.imagePaths.map(imagePath => path.basename(imagePath));    
        let assetNames = tutorial.assets.map(asset => path.basename(asset));    
        let linkNames = tutorial.linkPaths.map(link => path.basename(link));
        let coverImageName = path.basename(tutorial.coverImagePath);        
    
        assetNames.forEach(asset => {        
            if(coverImageName == asset) return;
            if(!imageNames.includes(asset) && !linkNames.includes(asset)){        
                console.log("❌ " + asset + " is not used in tutorial " + tutorial.path);
                errorOccurred = true;        
            }
        });
    });
    return errorOccurred;
});


/**
 * Verify that the images don't have an absolute path
 */
validator.addValidation((tutorials) => {
    let errorOccurred = false;
    tutorials.forEach(tutorial => {
        tutorial.imagePaths.forEach(imagePath => {
            if(imagePath.startsWith("/") || imagePath.startsWith("~")){
                console.log("❌ Image uses an absolute path: " + imagePath + " in " + tutorial.path);
                errorOccurred = true;
            }
        });
    });
    return errorOccurred;
});


/**
 * Verify that the images contain a description
 */
validator.addValidation((tutorials) => {
    let errorOccurred = false;
    tutorials.forEach(tutorial => {
       tutorial.imageNodes.forEach(image => {            
           const imageDescription = image.attributes.alt;
           if(imageDescription.split(" ").length <= 1){
               console.log("❌ Image doesn't have a description: " + image.attributes.src + " in " + tutorial.path);
               errorOccurred = true;
           }
       });
    });
    return errorOccurred;
});


 /**
  * Verify that only allowed syntax specifiers are used
  */
 validator.addValidation((tutorials) => {
    let errorOccurred = false;
    tutorials.forEach(tutorial => {         
        tutorial.codeNodes.forEach(codeNode => {
           let syntax = codeNode.classNames[0];
           if(syntax) syntax = syntax.replace(PARSER_SYNTAX_PREFIX, '');
           if(!config.allowedSyntaxSpecifiers.includes(syntax)){
               console.log("❌ Code block uses unsupported syntax: " + syntax + " in " + tutorial.path);
               errorOccurred = true;
           }
        });
    });
    return errorOccurred;
});

/**
 * Verifies that the content rules are met
 */
validator.addValidation((tutorials) => {
    let errorOccurred = false;
    tutorials.forEach(tutorial => {
        let htmlContent = tutorial.rawHTML;
        let markdownContent = tutorial.markdown;
    
        rules.forEach(rule => {
            const content = rule.format == "html" ? htmlContent :markdownContent;
            const regex = new RegExp(rule.regex, 'gm');
            const match = content.match(regex);
            if((match === null && rule.shouldMatch) || (match !== null && !rule.shouldMatch)) {
                console.log("❌ " + rule.errorMessage + " in " + tutorial.path);
                errorOccurred = true;
            }     
        });
    
    });
    return errorOccurred;
});

/**
 * Check if an error occurred and exit with the corresponding status code
 */
if(validator.validate()){
    console.log("✅ No errors found.")
    process.exit(0);
} else {
    process.exit(2);
}