const cfg = require("../cfg.json");
const r = require('rethinkdb');

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
function createTable(conn){
  return r.db(cfg.db.database).tableList().contains(cfg.db.table).run(conn).then((containsTable) => {
    if(containsTable){
      console.log('Table exists!')
      return conn
    } else {
      console.log('Creating Table!');
      return r.db(cfg.db.database).tableCreate(cfg.db.table, {primaryKey: "id"}).run(conn).then((conf) => {
        return conn;
      })
    }
  })
}

function createDbConnection() {
  console.log(`Connecting to database host: ${cfg.db.host}`);
  return r.connect({ host:cfg.db.host, port: cfg.db.port })
  .then(createDB)
  .then(createTable)
}
createDbConnection().then((dbconn) => {
  console.log('done');
  dbconn.close();
}).catch((err) => {
  console.error('Error conncting to db!');
  console.error(err);
})