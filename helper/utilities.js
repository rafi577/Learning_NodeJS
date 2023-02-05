
const crypto =  require('crypto');


const utilities = {};


utilities.parseJSON = (stringData)=>{
    let data;
    try{
        data = JSON.parse(stringData);
    }
    catch{
        console.log(data+' hello');
        data = {};
    }
}


utilities.hash = (data)=>{
    if(typeof data === 'string' && data.length>0){
        const hash = crypto.createHmac('sha256', 'abc').update(data).digest('hex');
        return hash;
    }
    else return false;
}


module.exports = utilities;