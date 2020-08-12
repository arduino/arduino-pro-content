const path = require('path');
const fs = require('fs');
const marked = require('marked');
const validate = require('jsonschema').validate;


let requiredContents = require('./required-contents');
let unsupportedContents = require('./unsupported-contents');

function matchAny(text, patterns, callback = null){
    let result = false;

    for(let pattern of patterns){
        if(text.indexOf(pattern) != -1){
            if(callback) callback(pattern);            
            result = true;
        }
    }
    return result;
}

function matchAll(text, patterns, callback = null){
    let result = true;

    for(let pattern of patterns){
        if(text.indexOf(pattern) == -1){   
            if(callback) callback(pattern);         
            result = false;
        }
    }
    return result;
}

function findAllFiles(startPath, filter, excludePatterns = [], matchingFiles = []) {    
    if(matchAny(startPath, excludePatterns)){
        // console.log("Excluding directory " + startPath);
        return matchingFiles;
    }
    
    // console.log('Starting from dir ' + startPath + '/');

    if (!fs.existsSync(startPath)) {
        console.log("Directory doesn't exist ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            findAllFiles(filename, filter, excludePatterns, matchingFiles);
        } else if (!matchAny(filename, excludePatterns) && filename.indexOf(filter) >= 0) {
            // console.log('-- found: ', filename);
            matchingFiles.push(filename);
        };
    };

    return matchingFiles;
};


const excludePatterns = [".git", "/portenta-h7/metadata.json", "/template/"];
let errorOccurred = false;

/**
 * Verify that all meta data files are valid JSON and contain the correct attributes
 */
let metaDataFiles = findAllFiles('../content/', 'metadata.json', excludePatterns);

if(metaDataFiles.length == 0) {
    console.log("No metadata files found.");
    errorOccurred = true;
}

metaDataFiles.forEach(path => { 
    try {
        let rawData = fs.readFileSync(path);    
        let jsonData = JSON.parse(rawData);

        if(!jsonData.coverImage){
            console.log("No cover image found for " + path);
            errorOccurred = true;            
        } else if (jsonData.coverImage.src.indexOf(".svg") == -1) {
            console.log("Cover image of " + path + "is not in SVG format.");
            errorOccurred = true;
        }
        
        let jsonSchema = JSON.parse(fs.readFileSync("./metadata-schema.json"));        
        let validationResult = validate(jsonData, jsonSchema);
        if(validationResult.errors.length != 0){
            console.log(validationResult);
            errorOccurred = true;
        }        

    } catch (error) {
        console.log("Parse error in " + path);
        console.log(error);
        errorOccurred = true;        
    }
});


/**
 * Verify that the content files contain the necessary data
 */

let contentFiles = findAllFiles('../content/', 'content.md', excludePatterns);

if(contentFiles.length == 0) {
    console.log("No content files found.");
    errorOccurred = true;
}

contentFiles.forEach(path => {
    try {        
        let rawData = fs.readFileSync(path);
        let markdown = rawData.toString();

        if(!matchAll(markdown, requiredContents, (match)=> {
            console.log(path + " doesn't contain the required content : " + match);
        })){
            errorOccurred = true;
        }

        let htmlContent = marked(markdown);        
        if(matchAny(htmlContent,unsupportedContents, (match) => {
            console.log(path + " contains unsupported content : " + match);
        })){
            errorOccurred = true;
        }        
        
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
