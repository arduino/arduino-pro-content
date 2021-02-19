const path = require('path');
const fs = require('fs');
const matcher = require('./matcher');

function getSubdirectories(path, excludePatterns = []){
    if (!fs.existsSync(path)) {        
        console.log("❌ Directory doesn't exist:", path);
        return;
    }

    var files = fs.readdirSync(path);
    let directories = [];
    files.forEach(file => {
        var fullPath = path + file;

        if (matcher.matchAny(fullPath, excludePatterns)) {            
            return;
        }

        var stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            directories.push(fullPath);
        }
    })
    return directories;    
}


/**
 * 
 * @param {The directory from which to start a recursive search} startPath 
 * @param {The file name that should be looked for} searchPattern 
 * @param {An array of paths that should be excluded from the search} excludePatterns 
 * @param {The matching files as recursion parameter} matchingFiles 
 */
function findAllFiles(startPath, searchPattern, excludePatterns = [], matchingFiles = []) {    
    if(matcher.matchAny(startPath, excludePatterns)){
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
        } else if (!matcher.matchAny(filename, excludePatterns)) {
            if(!searchPattern) {
                matchingFiles.push(filename);
                continue;
            }
            let patterns = Array.isArray(searchPattern) ? searchPattern : [searchPattern];            
            patterns.forEach(pattern => {
                if(filename.indexOf(searchPattern) >= 0){
                    // console.log('-- found: ', filename);
                    matchingFiles.push(filename);
                }
            });
        };
    };

    return matchingFiles;
};

module.exports = { findAllFiles, getSubdirectories};