const mysql = require("mysql");
function startConnection(dbconfig){
	const client = mysql.createPool(dbconfig);
	exports.client = client;
}
exports.connect = startConnection;
