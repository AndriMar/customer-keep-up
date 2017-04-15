var rt = require("rethinkdb");
var socket = require("socket.io");
var cfg = require("../cfg.json");
var dl;
var io;

var table = function(){
  return rt.db(cfg.db.database).table(cfg.db.table);
};


rt.connect({host: cfg.db.host, port: cfg.db.port}, (err, connection) => {
  if(err){console.log(err); process.exit(1);}
  conn = connection;
  table().changes().run(conn, (err, cursor) => {
    if(err){
      console.log("ERROR changes: ", err);
    } else {
      cursor.each((err, data) => {
        console.log('Getting all customers')
        setTimeout(function () {
          dl.getAllCustomers((err, data) => {
            if(err){
              console.log("ERROR emit: ", err);
            } else {
              io.emit("customerList", data);
            }
          });
        }, 100);
      });
    }
  });
});

module.exports = (server, dataLayer) => {
  dl = dataLayer;
  io = socket(server.server);

  io.on("connection", (client) => {
    console.log("client has connected");
  });
};
