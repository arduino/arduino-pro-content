const fileHelper = require('../lib/file-helper');
const generator = require("./datasheet-generator");

(async function main() {
    
    let args = process.argv.slice(2)
    if (args.length < 2) {
        console.log("Please pass the source and build folder as arguments.");
        process.exit(-1);
    }
    
    let datasheetsSourcePath = args[0];
    let datasheetsTargetPath = args[1];
    let datasheetFiles = fileHelper.findAllFiles(datasheetsSourcePath, ".md");        

    for(let filePath of datasheetFiles){
        console.log(`Generating datasheet for ${filePath} ...`);
        fileHelper.createDirectoryIfNecessary(datasheetsTargetPath)                
        await generator.generatePDFFromMarkdown(filePath, datasheetsTargetPath);
    }
    console.log("✅ %s Datasheets generated.", datasheetFiles.length);
    process.exit(0);    
})()