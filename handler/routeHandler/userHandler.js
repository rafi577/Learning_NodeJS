
const {hash} = require('../../helper/utilities');
const data = require('../../lib/data');

const handler = {};

handler.userHandler = (requestedProperties,callback)=>{
    //console.log(requestedProperties.body);
    const methodLimit = ['get','post','put','delete'];
    if(methodLimit.indexOf(requestedProperties.method)>-1){
        handler._users[requestedProperties.method](requestedProperties,callback);
    }
    else {
        callback(405);
    }
}



handler._users = {};

handler._users.post = (requestedProperties,callback)=>{
    const firstName = typeof requestedProperties.body.firstName === 'string' &&
     requestedProperties.body.firstName.trim().lenght > 0 ? requestedProperties.body.firstName : false;

     const lastName = typeof requestedProperties.body.lastName === 'string' && 
     requestedProperties.body.lastName.trim().lenght > 0 ? requestedProperties.body.lastName:false;

     const phone = typeof requestedProperties.body.phone === 'string' && 
     requestedProperties.body.phone.trim().lenght > 0 ? requestedProperties.body.phone:false;

     const password = typeof requestedProperties.body.password === 'string' &&
     requestedProperties.body.password.trim().lenght>=6 ? requestedProperties.body.password : false;

     const toAgreement = typeof requestedProperties.body.toAgreement === 'boolean' &&
     requestedProperties.body.toAgreement.trim().lenght>0 ? requestedProperties.body.toAgreement:false;

     if (firstName && lastName && phone && password && toAgreement) {
        
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    toAgreement,
                };
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    } 
                    else {
                        callback(500, { error: 'Could not create user!' });
                    }
                });
            } 
            else {
                callback(500, {
                    error: 'There was a problem in server side!',
                });
            }
        });
    } 
    else {
        console.log(requestedProperties.body.toString() + ' ' +firstName + ' ' + lastName)
        callback(400, {
            error: 'You have a problem in your request!',
        });
    }
    
    

 }
handler._users.get = (requestedProperties,callback)=>{
    callback(200);
}
handler._users.update = (requestedProperties,callback)=>{
    
}
handler._users.delete = (requestedProperties,callback)=>{
    
}


module.exports = handler;



//ok