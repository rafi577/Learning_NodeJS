
const {hash} = require('../../helper/utilities');
const{createRandomString} = require('../../helper/utilities')
const {parseJSON} = require('../../helper/utilities')
const data = require('../../lib/data');
const tokenHandler = require('./tokenHandler');


const handler = {};

handler.checkHandler = (requestedProperties,callback)=>{
    //console.log(requestedProperties.body);
    const methodLimit = ['get','post','put','delete'];
    if(methodLimit.indexOf(requestedProperties.method)>-1){
        handler.check[requestedProperties.method](requestedProperties,callback);
    }
    else {
        callback(405);
    }
}



handler.check = {};

handler.check.post = (requestProperties, callback) => {
    // validate inputs
    const req = requestProperties.body;
    const protocol =typeof req.protocol === 'string' && ['http', 'https'].indexOf(req.protocol) > -1? req.protocol: false;

    const url =typeof req.url === 'string' &&req.url.trim().length > 0? req.url: false;

    const method = typeof req.method === 'string' &&['GET', 'POST', 'PUT', 'DELETE'].indexOf(req.method) > -1 ? req.method : false;

    const successCodes = typeof req.successCodes === 'object' &&req.successCodes instanceof Array? req.successCodes: false;

    const timeoutSeconds = typeof req.timeoutSeconds === 'number' &&req.timeoutSeconds % 1 === 0 &&req.timeoutSeconds >= 1 &&req.timeoutSeconds <= 5? req.timeoutSeconds: false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        const token =typeof requestProperties.headersObject.token === 'string'? requestProperties.headersObject.token: false;

        // lookup the user phone by reading the token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                // lookup the user data
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler.token.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                const userObject = parseJSON(userData);
                                const userChecks = typeof userObject.checks === 'object' &&userObject.checks instanceof Array? userObject.checks : [];
                                if (userChecks.length < 5) {
                                    const checkId = createRandomString(20);
                                    const checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds,
                                    };
                                    // save the object
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            // add check id to the user's object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    // return the data about the new check
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error:
                                                            'There was a problem in the server side!',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'There was a problem in the server side!',
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'Userhas already reached max check limit!',
                                    });
                                }
                            } else {
                                console.log(requestProperties.headersObject.token);
                                callback(403, {
                                    error: 'Authentication problem!',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'User not found!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'Authentication problem!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};
handler.check.get = (requestedProperties,callback)=>{
}
handler.check.put = (requestedProperties,callback)=>{
}
handler.check.delete = (requestedProperties,callback)=>{
}


module.exports = handler;
