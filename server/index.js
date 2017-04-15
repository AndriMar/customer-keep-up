var restify = require("restify");
var path = require("path");
var customer = require("./customer.js");

var server = restify.createServer();
const PORT = 1337;

server.use(restify.bodyParser());
server.use(restify.queryParser());

customer(server);

server.get("/\/.*/", restify.serveStatic({
  directory: path.join(__dirname, "..", "dist"),
  default: "index.html" 
}));

server.listen(PORT, function(){
  console.log(`listening to port ${PORT}`);
});