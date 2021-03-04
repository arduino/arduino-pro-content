const Tutorial = require('./tutorial').Tutorial;

var Validator = class Validator {
    validatonCallbacks = [];

    constructor(tutorialPaths){                   
        this.tutorials = tutorialPaths.map(tutorialPath => new Tutorial(tutorialPath) );
    }

    addValidation(func) {
        this.validatonCallbacks.push(func);
    }

    async validate(){
        let errorsOccurred = 0;
        this.validatonCallbacks.forEach(validation => {
            errorsOccurred += validation(this.tutorials);
        });

        return errorsOccurred;
    }
}

module.exports = { Validator }