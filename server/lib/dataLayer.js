var settings = require("../cfg.json");

var customers = [];
var idCounter = 0;

var findCustomerIndex = (id) => {
  for(var i = 0; i < customers.length; i++){
    if(customers[i].id === id){
      return i;
    }
  }
  return -1;
}


var createCustomer = (customer, cb) => {
  customer.id = idCounter++;
  customers.push(customer);
  cb();
}

var updateCustomer = (customer, cb) => {
  var index = findCustomerIndex(customer.id);
  if(index === -1){
    cb("CUSTOMER_NOT_FOUND");
  } else {
    customers.splice(index, 1);
    customers.push(customer);
    cb();
  }
}

var deleteCustomer = (id, cb) => {
  var index = findCustomerIndex(parseInt(id));
  if(index === -1){
    cb("CUSTOMER_NOT_FOUND");
  } else {
    customers.splice(index, 1);
    cb();
  }
}

var customerContacted = (id, cb) => {
  var index = findCustomerIndex(parseInt(id));
  if(index === -1){
    cb("CUSTOMER_NOT_FOUND");
  } else {
    customers[index].lastContacted = new Date();
    cb();
  }
}

var getCustomer = (id, cb) => {
  var index = findCustomerIndex(parseInt(id));
  if(index === -1){
    cb("CUSTOMER_NOT_FOUND");
  } else {
    cb(null, customers[index]);
  }
}

var getAllCustomers = (cb) => {
    cb(null, customers);
}

var fun = {
  createCustomer: createCustomer,
  updateCustomer: updateCustomer,
  getCustomer: getCustomer,
  getAllCustomers: getAllCustomers,
  deleteCustomer: deleteCustomer,
  customerContacted: customerContacted
}

module.exports = fun;