const parser = require('node-html-parser');
const fileMatcher = require('./file-matcher');
const fs = require('fs');
const marked = require('marked');
const validate = require('jsonschema').validate;

let requiredContents = require('./required-contents');
let unsupportedContents = require('./unsupported-contents');

const excludePatterns = [".git", "/portenta-h7/metadata.json", "/template/"];
let errorOccurred = false;

/**
 * Verify that all meta data files are valid JSON and contain the correct attributes
 */
let metaDataFiles = fileMatcher.findAllFiles('../content/', 'metadata.json', excludePatterns);

if(metaDataFiles.length == 0) {
    console.log("❌ No metadata files found.");
    errorOccurred = true;
}

metaDataFiles.forEach(path => { 
    try {
        let rawData = fs.readFileSync(path);    
        let jsonData = JSON.parse(rawData);

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
        console.log("❌ Parse error in " + path);
        console.log(error);
        errorOccurred = true;        
    }
});


/**
 * Verify that SVG images don't contain embedded images
 */

 let svgFiles = fileMatcher.findAllFiles('../content/', '.svg');
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


/**
 * Verify that the content files contain the necessary data
 */

let contentFiles = fileMatcher.findAllFiles('../content/', 'content.md', excludePatterns);

if(contentFiles.length == 0) {
    console.log("❌ No content files found.");
    errorOccurred = true;
}

contentFiles.forEach(path => {
    try {        
        let rawData = fs.readFileSync(path);
        let markdown = rawData.toString();

        if(!fileMatcher.matchAll(markdown, requiredContents, (match)=> {
            console.log("❌ " + path + " doesn't contain the required content : " + match);
        })){
            errorOccurred = true;
        }

        let htmlContent = marked(markdown);        
        if(fileMatcher.matchAny(htmlContent,unsupportedContents, (match) => {
            console.log("❌ " + path + " contains unsupported content : " + match);
        })){
            errorOccurred = true;
        }
        
        const htmlDoc = parser.parse(htmlContent);
        let images = htmlDoc.querySelectorAll("img");        
        images.forEach(image => {
            const imagePath = image.attributes.src;
            if(imagePath.startsWith("/") || imagePath.startsWith("~")){
                console.log("❌ Image uses an absolute path: " + imagePath + " in " + path);
                errorOccurred = true;
            }             
            const imageDescription = image.attributes.alt;
            if(imageDescription.split(" ").length <= 1){
                console.log("❌ Image doesn't have a description: " + imagePath + " in " + path);
                errorOccurred = true;
            }
        });
        
    } catch (error) {   
        console.log(error);     
        errorOccurred = true;
    }
});

if(errorOccurred) {    
    process.exit(2);
} else {
    console.log("✅ No errors found.")
    process.exit(0);
}
