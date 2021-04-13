var ValidationError = class ValidationError {
    constructor(message, file, lineNumber = undefined){
        this.message = message;
        this.file = file;
        this.lineNumber = lineNumber;
    }
}

module.exports = { ValidationError }