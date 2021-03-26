const fileHelper = require('./lib/file-helper');
const parser = require("./datasheet-generator/parser");

const DATASHEETS_SOURCE_PATH = "../content/datasheets/";
const DATASHEETS_TARGET_PATH = "./datasheets";

(async function main() {
    let datasheetFiles = fileHelper.findAllFiles(DATASHEETS_SOURCE_PATH, ".md");        

    for(let filePath of datasheetFiles){
        console.log(`Generating datasheet for ${filePath} ...`);
        fileHelper.createDirectoryIfNecessary(DATASHEETS_TARGET_PATH)                
        await parser.generatePDFFromMarkdown(filePath, DATASHEETS_TARGET_PATH);
    }
    console.log("✅ %s Datasheets generated.", datasheetFiles.length);
    process.exit(0);    
})()