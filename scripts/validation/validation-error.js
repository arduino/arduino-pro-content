var ValidationError = class ValidationError {
    constructor(message, file, linenumber){
        this.message = message;
        this.file = file;
        this.linenumber = linenumber;
    }
}

module.exports = { ValidationError }