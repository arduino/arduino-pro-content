const fileHelper = require('../../lib/file-helper');
const fs = require('fs');
const fm = require('front-matter');
const marked = require('marked');
const parser = require('node-html-parser');
const htmlEntities = require('html-entities');

const HEADING_MAX_LEVEL = 4;

var Tutorial = class Tutorial {
    constructor(basePath){
        this.basePath = basePath;
    }

    get path(){
        return this.basePath;
    }

    get contentFilePath(){
        return this.basePath + "/content.md";
    }

    get markdown(){
        if(!fs.existsSync(this.contentFilePath)){
            console.log("❌ File doens't exist " + this.contentFilePath);
            return null;
        }
        let rawData = fs.readFileSync(this.contentFilePath).toString();
        const content = fm(rawData);
        return content.body;
    }

    get rawHTML(){
        const markdown = this.markdown
        return markdown ? marked(markdown) : null;
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
        return this.metadata.coverImage;
    }

    get imagePaths(){
        let images = this.html.querySelectorAll("img");
        return images.map(image => image.attributes.src);
    }

    get linkPaths(){
        let links = this.html.querySelectorAll("a");
        return links.map(link => link.attributes.href);
    }

    get assets(){
        let files = fileHelper.findAllFiles(this.basePath + "/assets/", null, [".DS_Store"]);
        return files.map(file => file.split("?")[0]);
    }

    get metadata(){    
        try {            
            let rawData = fs.readFileSync(this.contentFilePath).toString();
            const content = fm(rawData);
            return content.attributes;
        } catch (error) {
            console.log("Error occurred while parsing " + this.contentFilePath);
            console.log(error);
            return null;
        }
    }

    get svgAssets(){
        return fileHelper.findAllFiles(this.basePath + "/assets/", '.svg');
    }
}

module.exports = { Tutorial }