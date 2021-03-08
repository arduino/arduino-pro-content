const fileHelper = require('./file-helper');
const parser = require("./datasheet-generator/parser"); //TODO turn parser into a module

let datasheetFiles = fileHelper.findAllFiles("content/datasheets/", ".md");

for(let filePath of datasheetFiles){
    console.log(filePath);
    //TODO
    //parser.generatePDF(filePath);
}

console.log("✅ %s Datasheets generated.", datasheetFiles.length);
process.exit(0);