
const {sampleRoutes} = require('./handler/routeHandler/handler');
const {userHandler} = require('./handler/routeHandler/userHandler');
const {tokenHendler} = require('./handler/routeHandler/tokenHandler');



const routes = {
    sample : sampleRoutes,
    user : userHandler,
    token : tokenHendler,

};



module.exports = routes;