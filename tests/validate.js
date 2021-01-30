const parser = require('node-html-parser');
const matcher = require('./matcher');
const fs = require('fs');
const validate = require('jsonschema').validate;
const path = require('path');
const tc = require('title-case');
const Tutorial = require('./tutorial').Tutorial;

let requiredContents = require('./required-contents');
let unsupportedContents = require('./unsupported-contents');

const excludePatterns = [".git", "/template"];
let errorOccurred = false;

let tutorialPaths = matcher.getSubdirectories('../content/tutorials/portenta-h7/', excludePatterns);
let tutorials = tutorialPaths.map(tutorialPath => new Tutorial(tutorialPath) );

/**
 * Verify that all meta data files are valid JSON and contain the correct attributes
 */
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

/**
 * Verifies that there's title case being used
 */

 tutorials.forEach(tutorial => {
    tutorial.headings.forEach(heading => {        
        if(tc.titleCase(heading) != heading){
            console.log("❌ '" + heading + "' is not title case in tutorial " + tutorial.path);
            errorOccurred = true;
        }
    });
 });


/**
 * Verify that SVG images don't contain embedded images
 */
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


 /**
  * Verify that all files in the assets folder are referenced
  */
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

/**
 * Verify that the content files contain the necessary data
 */

 tutorials.forEach(tutorial => {
    try {                
        let markdown = tutorial.markdown;

        if(!matcher.matchAll(markdown, requiredContents, (match)=> {
            console.log("❌ " + path + " doesn't contain the required content : " + match);
        })){
            errorOccurred = true;
        }

        let htmlContent = tutorial.rawHTML;        
        if(matcher.matchAny(htmlContent,unsupportedContents, (match) => {
            console.log("❌ " + tutorial.path + " contains unsupported content : " + match);
        })){
            errorOccurred = true;
        }
        
        tutorial.imagePaths.forEach(imagePath => {
            if(imagePath.startsWith("/") || imagePath.startsWith("~")){
                console.log("❌ Image uses an absolute path: " + imagePath + " in " + tutorial.path);
                errorOccurred = true;
            }
        });

        let images = tutorial.imageNodes;        
        images.forEach(image => {            
            const imageDescription = image.attributes.alt;
            if(imageDescription.split(" ").length <= 1){
                console.log("❌ Image doesn't have a description: " + image.attributes.src + " in " + tutorial.path);
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
