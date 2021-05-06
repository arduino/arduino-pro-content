var ValidationError = class ValidationError {
    constructor(message, file, type = "error", lineNumber = undefined){
        this.message = message;
        this.file = file;
        this.type = type;
        this.lineNumber = lineNumber;
    }
}

module.exports = { ValidationError }