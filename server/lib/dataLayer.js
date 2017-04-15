var cfg = require("../cfg.json");
var rt = require("rethinkdb");
var conn;

rt.connect({host: cfg.db.host, port: cfg.db.port}, (err, connection) => {
  if(err){console.log(err); process.exit(1);}
  conn = connection;
});

var table = function(){
  return rt.db(cfg.db.database).table(cfg.db.table);
};

var createCustomer = (customer, cb) => {
  table().insert(customer).run(conn, (err, result) => {
    if(err){
      console.log("ERROR createCustomer: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      cb();
    }
  });
};

var updateCustomer = (customer, cb) => {
  table().get(customer.id).update(customer).run(conn, (err, result) => {
    if(err){
      console.log("ERROR updateCustomer: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      if(result.skipped === 1){
        cb({code: 404, obj: {error: "CUSTOMER_NOT_FOUND"}});
      } else {
        cb();
      }
    }
  });
};

var deleteCustomer = (id, cb) => {
  table().get(id).delete().run(conn, (err, result) => {
    if(err){
      console.log("ERROR deleteCustomer: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      if(result.skipped === 1){
        cb({code: 404, obj: {error: "CUSTOMER_NOT_FOUND"}});
      } else {
        cb();
      }
    }
  });
};

var customerContacted = (id, cb) => {
  table().get(id).update({lastContacted: new Date()}).run(conn, (err, result) => {
    if(err){
      console.log("ERROR customerContacted: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      if(result.skipped === 1){
        cb({code: 404, obj: {error: "CUSTOMER_NOT_FOUND"}});
      } else {
        cb();
      }
    }
  });
};

var getCustomer = (id, cb) => {
  table().get(id).run(conn, (err, result) => {
    if(err){
      console.log("ERROR getCustomer: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      if(result){
        cb(null, result);
      } else {
        cb({code: 404, obj: {error: "CUSTOMER_NOT_FOUND"}});
      }
    }
  });
};

var getAllCustomers = (cb) => {
  table().run(conn, (err, cursor) => {
    if(err){
      console.log("ERROR getAllCustomers: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      cursor.toArray((err, result) => {
        if(err){
          console.log("ERROR getAllCustomers:toArray: ", err);
          cb({code: 500, obj: {error: "RESULT_ERROR"}});
        } else {
          result.sort((a,b) => {
            if(a.lastContacted){
              if(b.lastContacted){
                return new Date(a.lastContacted).getTime() - new Date(b.lastContacted).getTime();
              } else {
                return -1;
              }
            } else {
              return 1;
            }
          });
          cb(null, result);
        }
      });
    }
  });
};

var fun = {
  createCustomer: createCustomer,
  updateCustomer: updateCustomer,
  getCustomer: getCustomer,
  getAllCustomers: getAllCustomers,
  deleteCustomer: deleteCustomer,
  customerContacted: customerContacted
};

module.exports = fun;