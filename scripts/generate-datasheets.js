const fileHelper = require('./lib/file-helper');
const parser = require("./datasheet-generator/parser");

(async function main() {
    let datasheetFiles = fileHelper.findAllFiles("../content/datasheets/", ".md");        

    for(let filePath of datasheetFiles){
        console.log(`Generating datasheet for ${filePath} ...`);
        const DATASHEET_PATH = "./datasheets";
        fileHelper.createDirectoryIfNecessary(DATASHEET_PATH)
        
        //TODO extract params from frontmatter
        //TODO infer filename from frontmatter
        await parser.generatePDFFromMarkdown(filePath, DATASHEET_PATH , 'Portenta Breakout', 'Rev. 01', 'PRO');
    }
    console.log("✅ %s Datasheets generated.", datasheetFiles.length);
    process.exit(0);    
})()