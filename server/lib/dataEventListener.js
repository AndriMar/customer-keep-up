var rt = require("rethinkdb");
var socket = require("socket.io");
var cfg = require("../cfg.json");
var dl;
var io;

if(process.env.DBHOST){
  cfg.db.host = process.env.DBHOST;
}

var customerTable = () => {
  return rt.db(cfg.db.database).table(cfg.db.customerTable);
};

var contactTable = () => {
  return rt.db(cfg.db.database).table(cfg.db.contactTable);
};

rt.connect({host: cfg.db.host, port: cfg.db.port}, (err, connection) => {
  if(err){console.log(err); process.exit(1);}
  conn = connection;
  //listen to customerTable
  customerTable().changes().run(conn, (err, cursor) => {
    if(err){
      console.log("ERROR Listening to customerTable: ", err);
    } else {
      cursor.each((err, data) => {
        dl.getAllCustomers((err, data) => {
          if(err){
            console.log("ERROR emit: ", err);
          } else {
            io.emit("customerList", data);
          }
        });
      });
    }
  });

  //listen to contactTable
  contactTable().changes().run(conn, (err, cursor) => {
    if(err){
      console.log("ERROR Listening to contactTable: ", err);
    } else {
      cursor.each((err, data) => {
        dl.getAllContactHistory((err, data) => {
          if(err){
            console.log("ERROR emit: ", err);
          } else {
            io.emit("contactHistory", data);
          }
        });
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
