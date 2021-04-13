var ValidationError = class ValidationError {
    constructor(message, file, linenumber = undefined){
        this.message = message;
        this.file = file;
        this.linenumber = linenumber;
    }
}

module.exports = { ValidationError }