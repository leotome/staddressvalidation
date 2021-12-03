const Datastore = require("nedb");
let db = { 
    "users" : new Datastore("users.db")
};

Object.keys(db).forEach((key) => {
    db[key].loadDatabase();
});

// Retorna o utilizador e sua password encriptadas
exports.cRud_login = (email) => {
	return new Promise((resolve, reject) => {
		const filter = { _id : email };
		db.users.findOne(filter, (error, user) => {
			if (error) {
				reject({ msg: "Problemas na base de dados!" });
			} else {
				if (user == null) {
					reject({ msg: "Utilizador inexistente!" });
				} else {
					resolve(user);
				}
			}
		});
	});
};

// Regista o utilizador
exports.Crud_registar = (email, password) => {
	return new Promise((resolve, reject) => {
		const filter = { _id : email };
		db.users.findOne(filter, (error, user) => {
			if (error) {
				reject({ msg: "Problemas na base de dados!" });
			} else {
				if (user == null) {
					var data = { _id: email, password: password };
					db.users.insert(data, (error, data) => {
						if (error) {
							reject(null);
						} else {
							resolve(data);
						}
					});
				} else {
					reject({ msg: "Utilizador existente!" });
				}
			}
		});
	});
};