const path = require('path');
const fs = require('fs');

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

/**
 * 
 * @param {The directory from which to start a recursive search} startPath 
 * @param {The file name that should be looked for} searchPattern 
 * @param {An array of paths that should be excluded from the search} excludePatterns 
 * @param {The matching files as recursion parameter} matchingFiles 
 */
function findAllFiles(startPath, searchPattern, excludePatterns = [], matchingFiles = []) {    
    if(matchAny(startPath, excludePatterns)){
        // console.log("Excluding directory " + startPath);
        return matchingFiles;
    }
    
    // console.log('Starting from dir ' + startPath + '/');

    if (!fs.existsSync(startPath)) {
        console.log("❌ Directory doesn't exist ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            findAllFiles(filename, searchPattern, excludePatterns, matchingFiles);
        } else if (!matchAny(filename, excludePatterns) && filename.indexOf(searchPattern) >= 0) {
            // console.log('-- found: ', filename);
            matchingFiles.push(filename);
        };
    };

    return matchingFiles;
};

module.exports = { findAllFiles, matchAll, matchAny };