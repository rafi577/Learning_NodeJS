
const {sampleRoutes} = require('./handler/routeHandler/handler');
const {userHandler} = require('./handler/routeHandler/userHandler');



const routes = {
    sample : sampleRoutes,
    user : userHandler
};



module.exports = routes;