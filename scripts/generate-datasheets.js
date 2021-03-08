const fileHelper = require('./file-helper');

let datasheetFiles = fileHelper.findAllFiles("content/datasheets/", ".md");

console.log("✅ %s Datasheets generated.", datasheetFiles.length);
process.exit(0);