const matcher = require('./matcher');
const Tutorial = require('./tutorial').Tutorial;

var Validator = class Validator {
    validatonCallbacks = [];

    constructor(config){
        this.config = config;
        const tutorialPaths = matcher.getSubdirectories(config.tutorialsPath, config.excludePatterns);
        this.tutorials = tutorialPaths.map(tutorialPath => new Tutorial(tutorialPath) );
    }

    addValidation(func) {
        this.validatonCallbacks.push(func);
    }

    validate(){
        let errorsOccurred = 0;
        this.validatonCallbacks.forEach(validation => {
            errorsOccurred += validation(this.tutorials);
        });

        return errorsOccurred;
    }
}

module.exports = { Validator }