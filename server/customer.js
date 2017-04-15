var dl = require("./lib/dataLayer.js");

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
}

var getAllCustomers = (req, res) => {
  dl.getAllCustomers((err, data) => {
    if(err){
      res.send(err.code, err.obj);
    } else {
      console.log(data);
      res.send(200, data);
    }
  })
}

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
}

var createCustomer = (req, res) => {
  if(req.body){
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
}

var deleteCustomer = (req, res) => {
  if(req.params && req.params.id){
    dl.deleteCustomer(req.params.id, (err) => {
      if(err){
        res.send(err.code, err.obj);
      } else {
        res.send(202);
      }
    });
  } else {
    //no id
    res.send(400, {"error": "BAD_REQUEST"});
  }
}

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
    //no body
    res.send(400, {"error": "BAD_REQUEST"});
  }
}

module.exports = (server) => {
  server.get("/customer", getAllCustomers);
  server.get("/customer/:id", getCustomer);
  server.put("/customer", updateCustomer);
  server.del("/customer/:id", deleteCustomer);
  server.post("/customer", createCustomer);
  server.put("/customer/contact/:id", customerContacted);
  require("./lib/dataEventListener.js")(server, dl);
}
