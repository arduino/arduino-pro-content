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
        return new Promise(resolve => {

            let promises = [];
            
            for(const validation of this.validatonCallbacks){
                promises.push(validation(this.tutorials));
            }
            Promise.all(promises).then(results => {                                
                resolve(results.reduce((total, errors) => { return total + errors; }));
            });

        });        
    }
}

module.exports = { Validator }