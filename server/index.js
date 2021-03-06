var restify = require("restify");
var path = require("path");
var customer = require("./customer.js");

const PORT = 1337;

var server = restify.createServer();

server.use(restify.bodyParser());
server.use(restify.queryParser());

customer(server);

server.get("/\/.*/", restify.serveStatic({
  directory: path.join(__dirname, "..", "dist"),
  default: "index.html"
}));

server.listen(PORT,"0.0.0.0", function(){
  console.log(`listening to port ${PORT}`);
});
