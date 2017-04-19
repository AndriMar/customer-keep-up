var cfg = require("../cfg.json");
var rt = require("rethinkdb");
const SECINDAY = 8.64e7;
var conn;

rt.connect({host: cfg.db.host, port: cfg.db.port}, (err, connection) => {
  if(err){console.log(err); process.exit(1);}
  console.log("Connected to Database");
  conn = connection;
});

var customerTable = () => {
  return rt.db(cfg.db.database).table(cfg.db.customerTable);
};

var contactTable = () => {
  return rt.db(cfg.db.database).table(cfg.db.contactTable);
};

var calculateDays = (data) => {
  return data.map((item) => {
    if(item.lastContacted){
      item.days = Math.floor(new Date()/SECINDAY) - Math.floor(new Date(item.lastContacted)/SECINDAY);
    }

    return item;
  });
};

var createContactMap = (data) => {
  //History is used so that multiple contacts per day for the same customer is not counted
  var history = [];
  var tmpResult = {};
  var result = [];
  for(var i = 0; i < data.length; i++) {
    var dayNumber = Math.floor(new Date(data[i].contact)/SECINDAY);
    var customer = data[i].customerId;
    if(!history[customer]){
      history[customer] = [];
    }

    if(!history[customer][dayNumber]){
      if(!tmpResult[dayNumber]){
        tmpResult[dayNumber] = {};
        tmpResult[dayNumber].date = data[i].contact;
        tmpResult[dayNumber].count = 0;
      }
      tmpResult[dayNumber].count++;
      
      history[customer][dayNumber] = true;
    }
  }

  var keys = Object.keys(tmpResult);

  for(var i = 0; i < keys.length; i++){
    result.push(tmpResult[keys[i]]);
  }

  return result;
}

var createCustomer = (customer, cb) => {
  customerTable().insert(customer).run(conn, (err, result) => {
    if(err){
      console.log("ERROR createCustomer: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      cb();
    }
  });
};

var updateCustomer = (customer, cb) => {
  var id = customer.id;

  //dont allow user to change/save these parameters
  delete customer.days;
  delete customer.lastContacted;
  delete customer.id;

  customerTable().get(id).update(customer).run(conn, (err, result) => {
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
  customerTable().get(id).delete().run(conn, (err, result) => {
    if(err){
      console.log("ERROR deleteCustomer: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      if(result.skipped === 1){
        cb({code: 404, obj: {error: "CUSTOMER_NOT_FOUND"}});
      } else {
        contactTable().filter({"customerId": id}).delete().run(conn, (err, result) => {
          if(err){
            console.log("ERROR deleteCustomerHistory: ", err);
            cb({code: 500, obj: {error: "DATABASE_ERROR"}});            
          } else {
            cb();
          }
        });
      }
    }
  });
};

var customerContacted = (id, cb) => {
  var date = new Date();
  customerTable().get(id).update({lastContacted: date}).run(conn, (err, result) => {
    if(err){
      console.log("ERROR update customer lastContacted: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      if(result.skipped === 1){
        cb({code: 404, obj: {error: "CUSTOMER_NOT_FOUND"}});
      } else {
        contactTable().insert({"customerId": id, "contact": date}).run(conn, (err, result) => {
          if(err){
            console.log("ERROR insert ContactedTable: ", err);
            cb({code: 500, obj: {error: "DATABASE_ERROR"}});
          } else {
            cb();
          }
        });
      }
    }
  });
};

var getCustomerContactHistory = (id, cb) => {
  contactTable().filter({"customerId": id}).withFields("contact").run(conn, (err, cursor) => {
    if(err){
      console.log("ERROR getCustomerContactHistory: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});      
    } else {
      cursor.toArray((err, result) => {
        if(err){
          console.log("ERROR getCustomerContactHistory:toArray: ", err);
          cb({code: 500, obj: {error: "RESULT_ERROR"}});
        } else {
          cb(null, result.map((item) => {
            return item.contact;
          }));
        }
      });
    }
  });
}

var getAllContactHistory = (cb) => {
  contactTable().run(conn, (err, cursor) => {
    if(err){
      console.log("ERROR getAllCustomers: ", err);
      cb({code: 500, obj: {error: "DATABASE_ERROR"}});
    } else {
      cursor.toArray((err, result) => {
        if(err){
          console.log("ERROR getAllCustomers:toArray: ", err);
          cb({code: 500, obj: {error: "RESULT_ERROR"}});
        } else {
          cb(null, createContactMap(result));
        }
      });
    }
  });
}

var getCustomer = (id, cb) => {
  customerTable().get(id).run(conn, (err, result) => {
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
  customerTable().run(conn, (err, cursor) => {
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
          cb(null, calculateDays(result));
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
  customerContacted: customerContacted,
  getCustomerContactHistory: getCustomerContactHistory,
  getAllContactHistory: getAllContactHistory
};

module.exports = fun;