const matcher = require('./matcher');
const fs = require('fs');
const marked = require('marked');
const parser = require('node-html-parser');

var Tutorial = class Tutorial {
    constructor(basePath){
        this.basePath = basePath;
    }

    get path(){
        return this.basePath + "/content.md";
    }

    get markdown(){
        let rawData = fs.readFileSync(this.path);
        return rawData.toString();
    }

    get rawHTML(){
        return marked(this.markdown);
    }

    get html(){
        return parser.parse(this.rawHTML);
    }

    get assets(){
        return matcher.findAllFiles(this.basePath + "/assets/", null, [".DS_Store"])
    }

    get metadata(){
        // if(metaDataFiles.length == 0) {
        //     console.log("❌ No metadata files found.");
        //     errorOccurred = true;
        // }
        try {
            const metadataPath = this.basePath + "/metadata.json";
            let rawData = fs.readFileSync(metadataPath);    
            return JSON.parse(rawData);
        } catch(error){
            console.log("❌ Parse error in " + metadataPath);
            console.log(error);
            return null;
        }
    }

    get svgAssets(){
        return matcher.findAllFiles(this.basePath + "/assets/", '.svg');
    }
}

module.exports = { Tutorial }