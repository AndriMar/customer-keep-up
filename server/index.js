var restify = require("restify");
var server = restify.createServer();
var customer = require("./customer.js");
const PORT = 1337;

server.use(restify.bodyParser());
server.use(restify.queryParser());

customer(server);

server.listen(PORT, function(){
  console.log(`listening to port ${PORT}`);
});