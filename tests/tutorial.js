const matcher = require('./matcher');
const fs = require('fs');
const marked = require('marked');
const parser = require('node-html-parser');
const htmlEntities = require('html-entities');

const HEADING_MAX_LEVEL = 4;

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
        return parser.parse(this.rawHTML, {
			blockTextElements: {
				script: true,
				noscript: true,
				style: true,                
                code: false
            }
        });
    }

    get imageNodes(){
        return this.html.querySelectorAll("img"); 
    }

    get codeNodes(){
        return this.html.querySelectorAll("pre code");
    }

    get headings(){
        let headings = [];
        for(let i = 1; i <= HEADING_MAX_LEVEL; ++i) {
            let currentHeadings = this.html.querySelectorAll("h" + i);
            headings = headings.concat(currentHeadings.map(heading => htmlEntities.decode(heading.innerText)));            
        }
        return headings;
    }

    get coverImagePath() {
        return this.metadata.coverImage.src.split("?")[0];
    }

    get imagePaths(){
        let images = this.html.querySelectorAll("img");
        return images.map(image => image.attributes.src.split("?")[0]);
    }

    get linkPaths(){
        let links = this.html.querySelectorAll("a");
        return links.map(link => link.attributes.href);
    }

    get assets(){
        let files = matcher.findAllFiles(this.basePath + "/assets/", null, [".DS_Store"]);
        return files.map(file => file.split("?")[0]);
    }

    get metadata(){    
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