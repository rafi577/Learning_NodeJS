const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes');
const {notFoundRoute} = require('../handler/routeHandler/notFoundHandler');
const {parseJSON} = require('./utilities');


const handle = {};

handle.handleReqRes = (req,res)=>{
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;
    
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    }

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath]:notFoundRoute;

    

    
    const decoder = new StringDecoder('utf-8');
    let realData = '';
    req.on('data',(buffer)=>{
        realData+=decoder.write(buffer);
    })
    req.on('end',()=>{
        realData += decoder.end();

        //requestProperties.body = parseJSON(realData);
        //console.log(requestProperties.body);
        requestProperties.body = realData;

        chosenHandler(requestProperties,(statusCode,payload)=>{
            statusCode = typeof statusCode === 'number' ? statusCode:500;
            payload = typeof payload === 'object' ? payload:{};
    
            const payloadString = JSON.stringify(payload);
    
            res.writeHead(statusCode);
            res.end(payloadString);
        })
    })

}

module.exports = handle;


