var pg = require("pg");
var cfg = require("../cfg.json");
var client = new pg.Client(cfg.db);

client.connect((err) => {
	if(err){
		console.log(err);
	} else {
		client.query(`select * from pg_class where relname='customers';`, (err, res) => {
			if(err){
				console.log("SELECT ERR:", err);
				client.end((err) => {
					if(err) {console.log("CLOSE ERROR:", err);}
				})
			} else {
				if(res.rows && res.rows.length === 1){
					console.log("already Exists", res.rows.length);
					client.end((err) => {
						if(err) {console.log("CLOSE ERROR:", err);}
					})
				} else if(res.rows && res.rows.length === 0){
					console.log("Table needs to be created");
					client.query(`CREATE TABLE ${cfg.db.table} (\
					    id bigserial primary key,\
					    organizationName text NOT NULL,\
					    contactName text NOT NULL,\
					    phone text NOT NULL,\
					    address text NOT NULL,\
					    lastContacted timestamp NULL\
						);`, (err, res) => {
							if(err) { console.log("ERR CREATE TABLE:", err);}
							console.log("Create Response: ", res);
							client.query(`INSERT INTO ${cfg.db.table} (organizationName, contactName, phone, address)\
								VALUES ('testOrg', 'testCont', 'testPhone', 'address');`, (err, res) => {
									if(err){console.log("ERR ADD EXAMPLE CUSTOMER: ", err);}
									console.log("insert response: ", res);
									client.end((err) => {
										if(err) {console.log("CLOSE ERROR:", err);}
									})
								});
						});


				}
			}

		});
	}
});