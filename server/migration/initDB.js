const cfg = require("../cfg.json");
const r = require('rethinkdb');
var csv = require("fast-csv");
var dl = require("../lib/dataLayer");
var fs = require("fs");


function createDB(conn) {
  return r.dbList().contains(cfg.db.database).run(conn).then((containsDb) => {
    if(containsDb){
      console.log('Database exists!');
      return conn;
    } else {
      console.log('Creating db!');
      return r.dbCreate(cfg.db.database).run(conn).then((conf) => {
        return conn
      })
    }
  })
}
function createCustomerTable(conn){
  return r.db(cfg.db.database).tableList().contains(cfg.db.customerTable).run(conn).then((containsTable) => {
    if(containsTable){
      console.log('Table customerTable exists!')
      return conn
    } else {
      console.log('Creating customerTable Table!');
      return r.db(cfg.db.database).tableCreate(cfg.db.customerTable, {primaryKey: "id"}).run(conn).then((conf) => {
        return conn;
      })
    }
  })
}

function createContactTable(conn){
  return r.db(cfg.db.database).tableList().contains(cfg.db.contactTable).run(conn).then((containsTable) => {
    if(containsTable){
      console.log('Table ContactTable exists!')
      return conn
    } else {
      console.log('Creating ContactTable Table!');
      return r.db(cfg.db.database).tableCreate(cfg.db.contactTable, {primaryKey: "id"}).run(conn).then((conf) => {
        return conn;
      })
    }
  })
}

function createContactIndex(conn){
  //need to check if index exists
  return r.db(cfg.db.database).table(cfg.db.contactTable).indexList().contains("customerId").run(conn).then((containsIndex) => {
    if(containsIndex) {
      console.log("Index Exists");
      return conn;
    } else {
      return r.db(cfg.db.database).table(cfg.db.contactTable).indexCreate("customerId").run(conn).then((err, res) => {
        console.log("Index Created for customerId in table " + cfg.db.contactTable);
        return conn;
      });
    }
  });

}

function initCustomers(conn, cb){
fs.createReadStream(require('os').homedir()+"/customer.csv")
    .pipe(csv())
    .on("data", function(data){
      console.log("inData");
        for(var i = 0; i < data.length; i++){
          var obj = {};
          obj.company = data[i];
          dl.createCustomer(obj, (err) => {if(err){console.log("Error initing customers", err)}});
        }
    })
    .on("end", function(){
        cb();
    });
}

function createDbConnection() {
  console.log(`Connecting to database host: ${cfg.db.host}`);
  return r.connect({ host:cfg.db.host, port: cfg.db.port })
  .then(createDB)
  .then(createCustomerTable)
  .then(createContactTable)
  .then(createContactIndex);
}
createDbConnection().then((dbconn) => {
  initCustomers(dbconn, () => {
    console.log('done');
    dbconn.close();
  });

}).catch((err) => {
  console.error('Error conncting to db!');
  console.error(err);
})
