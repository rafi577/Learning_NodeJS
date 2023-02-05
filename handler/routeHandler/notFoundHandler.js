
const routeHandler = {};

routeHandler.notFoundRoute = (requestedProperties,callback)=>{
    //console.log(requestedProperties);
    callback(404,{
        message : "Page not Found!",
    })
}

module.exports = routeHandler;