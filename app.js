const http = require('http');
const {handleReqRes} = require('./helper/handleRequest');
//const environment = require('./helper/environment')
const data = require('./lib/data')


const app = {};

app.config = {
    port:3003,
}

data.delete('test','myTest2',(err)=>{
    console.log(err);
})


app.createServer = ()=>{
    const server = http.createServer(app.handleRequest);
    server.listen(app.config.port,()=>{
        console.log('listening on port '+ app.config.port+ '...');
    })
}

app.handleRequest = handleReqRes;

app.createServer();

