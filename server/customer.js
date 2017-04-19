var dl = require("./lib/dataLayer.js");
var cfg = require("./cfg.json");

var getCustomer = (req, res) => {
  if(req.params && req.params.id){
    dl.getCustomer(req.params.id, (err, data) => {
      if(err){
        res.send(err.code, err.obj);
      } else {
        res.send(200, data);
      }
    });
  } else {
    //no Id
    res.send(400, {"error": "BAD_REQUEST"});
  }
};

var getAllCustomers = (req, res) => {
  dl.getAllCustomers((err, data) => {
    if(err){
      res.send(err.code, err.obj);
    } else {
      res.send(200, data);
    }
  });
};

var updateCustomer = (req, res) => {
  if(req.body){
    dl.updateCustomer(req.body, (err) => {
      if(err) {
        res.send(err.code, err.obj);
      } else {
        res.send(202);
      }
    });
  } else {
    //no body
    res.send(400, {"error": "BAD_REQUEST"});
  }
};

var createCustomer = (req, res) => {
  //creating a customer must include name of company
  if(req.body && req.body.company){
    dl.createCustomer(req.body, (err) => {
      if(err) {
        res.send(err.code, err.obj);
      } else {
        res.send(202);
      }
    });
  } else {
    //no body
    res.send(400, {"error": "BAD_REQUEST"});
  }
};

var deleteCustomer = (req, res) => {
  if(req.params && req.params.id){
    if(req.headers && req.headers.token){
      if(req.headers.token === cfg.deletePassword){
        dl.deleteCustomer(req.params.id, (err) => {
          if(err){
            res.send(err.code, err.obj);
          } else {
            res.send(202);
          }
        });
      } else {
        console.log(`Incorrect token '${req.headers.token}' when deleting customer ${req.params.id}`);
        res.send(403, {"error": "INCORRECT_TOKEN"});
      }      
    } else {
      console.log(`Missing Token when deleting customer ${req.params.id}`);
      res.send(403, {"error": "INCORRECT_TOKEN"});
    }
  } else {
    //no id
    res.send(400, {"error": "BAD_REQUEST"});
  }
};

var customerContacted = (req, res) => {
  if(req.params && req.params.id){
    dl.customerContacted(req.params.id, (err) => {
      if(err) {
        res.send(err.code, err.obj);
      } else {
        res.send(202);
      }
    });
  } else {
    //no parameter
    res.send(400, {"error": "BAD_REQUEST"});
  }
};

var getAllContactHistory = (req, res) => {
  dl.getAllContactHistory((err, result) => {
    if(err) {
      res.send(err.code, err.obj);
    } else {
      res.send(200, result);
    }
  });
};

var getCustomerContactHistory = (req, res) => {
  if(req.params && req.params.id){
    dl.getCustomerContactHistory(req.params.id, (err, result) => {
      if(err) {
        res.send(err.code, err.obj);
      } else {
        res.send(200, result);
      }
    });
  } else {
    //no parameter
    res.send(400, {"error": "BAD_REQUEST"});
  }
};

module.exports = (server) => {
  server.get("/customer/contact", getAllContactHistory);
  server.put("/customer/contact/:id", customerContacted);
  server.get("/customer/contact/:id", getCustomerContactHistory);
  server.get("/customer", getAllCustomers);
  server.put("/customer", updateCustomer);
  server.post("/customer", createCustomer);
  server.get("/customer/:id", getCustomer);
  server.del("/customer/:id", deleteCustomer);
  require("./lib/dataEventListener.js")(server, dl);
}
