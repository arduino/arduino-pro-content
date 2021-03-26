const marked = require('marked')
const fm = require('front-matter')
const fs = require('fs')
const path = require('path');
const jsdom = require('jsdom')
const pdf = require('html-pdf')
const util = require('util')
const pdfParser = require('pdf-parse')
const express = require('express')

const SERVER_PORT = 8000
const STYLES_PATH = "datasheet-generator/styles"
const PRO_CSS_PATH = `${STYLES_PATH}/pro-style.css`
const SUBTITLE = "Product Reference Manual"

//console.log(util.inspect(contentIndex, {showHidden: false, depth: null}))

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
const createPdf = util.promisify(pdf.create)

let contentListText = []
let contentListMap = []

const numberHeadings = (dom) => {
    let contentIndex = { H2:0, H3:0, H4:0, H5:0, H6:0 }

    // add content list section
    contentTitle = dom.window.document.getElementById("contents")
    let contentList = dom.window.document.createElement("div")
    addNodeAfter(contentTitle, contentList)

    dom.window.document.querySelectorAll("h2, h3, h4, h5, h6").forEach(element => {
        contentIndex[element.nodeName]++
        element.textContent = ' ' + element.textContent

        switch(element.nodeName) {
            case "H6":
                element.textContent = '.' + contentIndex.H6 + element.textContent
            case "H5":
                element.textContent = '.' + contentIndex.H5 + element.textContent
            case "H4":
                element.textContent = '.' + contentIndex.H4 + element.textContent
            case "H3":
                element.textContent = '.' + contentIndex.H3 + element.textContent
            case "H2":
                element.textContent = contentIndex.H2 + element.textContent
        }

		// temporary save header text for future calculation of page numbers
        contentListText.push(element.textContent)
        
        switch(element.nodeName) {
            case "H2":
                contentIndex.H3 = 0
            case "H3":
                contentIndex.H4 = 0
            case "H4":
                contentIndex.H5 = 0
            case "H5":
                contentIndex.H6 = 0
        }

        addElementToContentIndex(dom, contentList, element)
    })
}

const prepareTitlePage = (dom) => {
    //FIXME is it safe to assume that the first image is the featured image?
    let featuredPicture = dom.window.document.querySelector("img")
    featuredPicture.setAttribute("id", "featured-picture")
}

const addElementToContentIndex = (dom, contentList, element) => {
    let contentItem = dom.window.document.createElement('div')
    contentList.setAttribute("id", "content-list");
    //let link = dom.window.document.createElement('a')
    let linkText = dom.window.document.createTextNode(element.textContent)
    
    contentItem.classList.add('list-' + element.nodeName)
    //link.title = element.textContent
    //link.href = "#" + element.id
    //link.appendChild(linkText)
    contentItem.appendChild(linkText)
    contentList.appendChild(contentItem)
	contentListMap.push({
		id: element.textContent,
		pageNumber: 0,
		item: contentItem
	})
}

const addPageNumberToContentList = (dom, contentList) => {
    contentList.forEach(element => {
		let numberItem = dom.window.document.createElement('div')
		numberItem.setAttribute("class", "page-number");
		numberItem.innerHTML = element.pageNumber
		element.item.appendChild(numberItem)
		element.item.nodeValue = element.item.nodeValue
	})
}

const addNodeAfter = (rootElement, newElement) => {
    rootElement.parentNode.insertBefore(newElement, rootElement.nextSibling)
}

const createHtml = (mdContent) => {
    // convert md to dom-nodes
    const htmlContent = marked(mdContent)
    let dom = new jsdom.JSDOM(htmlContent)

    // number sections + create content index
    numberHeadings(dom)

    // add IDs to special sections
    prepareTitlePage(dom)

    return dom
}

const injectData = (dom, cssContent) => {
        
    // Inject CSS styles
    let style = dom.window.document.createElement("style")
    style.appendChild(dom.window.document.createTextNode(cssContent))
    dom.window.document.head.appendChild(style)

    // Inject Subtitle
    let subtitle = dom.window.document.createElement("div")
    subtitle.appendChild(dom.window.document.createTextNode(SUBTITLE))
    subtitle.classList.add("subtitle")
    dom.window.document.body.prepend(subtitle)

    return dom.serialize()
}

const writeContent = async (filename, content) => {
    return writeFile(filename, content)
}

const readContent = async (path) => {
    return readFile(path, 'utf8')
}

const preparePdfProperties = (style, contentURL, pdfFilename, boardName, revisionNumber) => {
    const specificLogoSVGdata = fs.readFileSync(`${STYLES_PATH}/${style}-logo.svg`)
    const genericLogoSVGdata = fs.readFileSync(`${STYLES_PATH}/generic-logo.svg`)

    if (style === 'pro') {
        return options = {
            format: 'A4', 
            filename: pdfFilename,
            "base": contentURL, 
            "border": {          
                "right": "20mm",
                "left": "20mm"
            },
            "header": {
                "height": "35mm",
                "contents": {
                    first: `
                        <hr style="margin-top:50px;" />
                        <div class="logo-front">${specificLogoSVGdata}</div>
                        <div class="title-front">${boardName}</div>                        
                        <hr />                        
                    `,
                    default: `
                        <div class="logo">${genericLogoSVGdata}</div>
                    `
                }
            },
            "footer": {
                "height": "28mm",
                "contents": {
                first: ' ',
                default: `
                    <hr />
                    <div style="position: absolute;">
                        <span><strong>{{page}}</strong></span> / <span><strong>{{pages}}</strong></span>
                    </div>
                    <div class="footer">
                        ${boardName} / ${revisionNumber} - ${getCurrentDateString()}
                    </div>                    
                `
                }
            }  
        }
    }
    return null
}

const createPdfFromHtml = async (src, pdfProperties) => {
    let htmlContent = await readContent(src)
    await createPdf(htmlContent, pdfProperties)
}

const getCurrentDateString = () => {
    let today = new Date()
    let dd = today.getDate()

    let mm = today.getMonth() + 1
    let yyyy = today.getFullYear()
    if (dd < 10)
        dd = '0' + dd
    if (mm < 10)
        mm = '0' + mm
    return dd + '/' + mm + '/' + yyyy
}

const findPageNumbers = async (pdfPath, title, revision) => {
    let dataBuffer = fs.readFileSync(pdfPath)
    
    await pdfParser(dataBuffer).then(function(data) {
        let pdfContent = data.text.replace(/\t+/g, " ")
		pdfContent = pdfContent.replace(/\n+/g, " ")

		contentListText.forEach(element => {
			let findings = pdfContent.split(element)
			let pageNumber = data.numpages - countCurrentPage(findings[findings.length - 1], title, revision)
			//console.log(element + " is on page " + pageNumber + " out of " + data.numpages)

			let contentItem = contentListMap.find(obj => {
				return obj.id === element
			})
			contentItem.pageNumber = pageNumber
        })

        
    })    
}

const countCurrentPage = (snippet, title, revision) => {
	// count footers to assess number of pages
	return snippet.split(`${title} / ${revision} - ${getCurrentDateString()}`).length - 1
}

const getStylesheetForType = (type) => {
    switch(type){
        case "pro":
            return PRO_CSS_PATH;
        default:
            throw new Error("Front matter contains unsupported 'type' value" + type)            
    }
}

const getMetadata = (data) => {  
    if(!fm.test(data)){
        throw new Error("File doesn't contain front matter.")
    }  
    return fm(data).attributes
}

const getMarkdownContent = (data) => {    
    return fm(data).body
}

const generatePDFFromMarkdown = async (sourceFile, targetPath) => {
    const data = await readContent(sourceFile)    
    const metaData = getMetadata(data)    
    const { identifier, title, revision, type } = metaData;
    const datasheetName = identifier + ".pdf"
    const datasheetHTMLName = identifier + ".html"    
    const contentURL = `http://localhost:${SERVER_PORT}`;
    
    let mdContent = getMarkdownContent(data)
    let cssContent = await readContent(getStylesheetForType(type))

    let dom = createHtml(mdContent)
    injectData(dom, cssContent)
	let htmlSerialized = dom.serialize()
    
    await writeContent(`${targetPath}/${datasheetHTMLName}`, htmlSerialized)
    console.log("Completed MD to HTML \t--> \tstep 1 of 4")

	let server = express()
	server.use(express.static(`${path.dirname(sourceFile)}/`))
	let serverInstance = server.listen(SERVER_PORT)    

    const pdfProperties = preparePdfProperties(type, contentURL, `${targetPath}/${datasheetName}`, title, revision)
    await createPdfFromHtml(`${targetPath}/${datasheetHTMLName}`, pdfProperties)
    console.log("Prepare PDF \t\t--> \tstep 2 of 4")

    await findPageNumbers(`${targetPath}/${datasheetName}`, title, revision)
	
	addPageNumberToContentList(dom, contentListMap)
	htmlSerialized = dom.serialize()
	await writeContent(`${targetPath}/${datasheetHTMLName}`, htmlSerialized)
    console.log("Calculate page numbers \t--> \tstep 3 of 4")
	await createPdfFromHtml(`${targetPath}/${datasheetHTMLName}`, pdfProperties)
    console.log("Finalize PDF \t\t--> \tstep 3 of 4")
	console.log("---------------")
    console.log("Finished! Datasheet saved in: " + targetPath + "/" + datasheetName)
	serverInstance.close()
}

module.exports = { generatePDFFromMarkdown };