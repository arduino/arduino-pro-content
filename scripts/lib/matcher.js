function matchAny(text, patterns, callback = null){
    let result = false;

    for(let pattern of patterns){
        if(text.indexOf(pattern) != -1){
            if(callback) callback(pattern);            
            result = true;
        }
    }
    return result;
}

function matchAll(text, patterns, callback = null){
    let result = true;

    for(let pattern of patterns){
        if(text.indexOf(pattern) == -1){   
            if(callback) callback(pattern);         
            result = false;
        }
    }
    return result;
}

module.exports = { matchAll, matchAny};