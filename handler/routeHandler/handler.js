

const routeHandle = {};

routeHandle.sampleRoutes = (requestedProperties,callback)=>{
    console.log(requestedProperties);
    callback(200,{
        message : "This is sample Route Page!",
    })
}

module.exports = routeHandle;