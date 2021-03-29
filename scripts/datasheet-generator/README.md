# Datasheet-Infrastructure

This tool allows for creating datasheet-PDFs from a markdown file.

## Installation
-   Nodejs & npm have to be installed.
-   Install dependencies via ```npm install```

## Create a new datasheet
-   Within the directory ```/content```, create a folder for the new datasheet 
-   In your newly created folder create the ```content.md``` file that includes the content of the datasheet as well as a subfolder called ```assets```

## Automated creations
-   The first picture in the ```content.md``` file will be used as title picture on the front page eg. ```![](assets/featured.jpg)```
-   The sections `#Description, #Target areas & #Features` will be part of the front page
-   Create the `# Contents` section. This section is special, **no content should be added in this section**, it will be created **automatically**

## Pictures & picture descriptions
-   jpg, png, svg are the recommended file formats
-   Picture without a description element underneath: `![](assets/featured.jpg)`
-   Picture with a description element underneath: `![This is a cool description](assets/test.svg)`

## Handling table elements
Not a must in terms of the correct compilation of a MD datasheet, but still recommended for readability purposes, is using a **markdown table prettifier** such as the [darkriszty.markdown-table-prettify](https://marketplace.visualstudio.com/items?itemName=darkriszty.markdown-table-prettify) extension for Visual Studio Code or using *visual* markdown editors such as [Typora](https://typora.io/).

## Compile the datasheet
This is relevant if wanting to compiling the datasheets offline:
1.  `cd scripts`
2.  `node generate-datasheets.js`