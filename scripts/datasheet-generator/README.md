# Datasheet-Infrastructure

This tool allows for creating datasheet-PDFs from a markdown file.

## Installation
-   Nodejs & npm have to be installed.
-   Install dependencies via ```npm install```

## Create a new datasheet
-   Within the directory ```/content```, create a folder for the new datasheet 
-   In your newly created folder create the ```content.md``` file that includes the content of the datasheet as well as a subfolder called ```assets```
-   Make sure to copy the ```logo.png``` from the template folder into your assets (used for the document header)

## Automated creations
-   The first picture in the ```content.md``` file will be used as title picture on the front page eg. ```![Portenta H7](assets/featured.jpg)```
-   The first section should be the `# Features` section that will be part of the front page
-   After the `# Features` section create the `# Contents`section. This section is special, **no content should be added in this section**, it will be created **automatically**

## Compile the datasheet
From the main directory of this tool, start the nodejs script and pass:
1. The folder name eg. `portenta-breakout-board`
2. The Title of the datasheet eg. `Portenta Breakout`
3. The revision number of the datasheet (will be printed in the footer of the document) eg. `Rev. 01`

### Example
`node parser.js portenta-breakout-board "Portenta Breakout" "Rev. 01"`