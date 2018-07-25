var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'sql3.freemysqlhosting.net',
  port: 3306,
  user     : 'sql3248521',
  password : 'vKzdBftRjn',
  database: 'sql3248521',
  insecureAuth: true
});

connection.connect();
module.exports = connection;

