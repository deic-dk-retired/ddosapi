// var express = require('express');
// var pg = require('pg');
// var pgp = require('pg-promise');

// var app = express();
// var connStr = 'postgres:flowuser:Gbr(Ff)wCJOF@localhost/netflow';
// var client = new pg.Client(connStr);
// var sql = "SELECT administratorid as userid, customerid as custid, kind, name, username from flow.administrators where valid = 'TRUE' order by username ASC";
// var data = "";

// client.connect(function(err) {
//   if (err) {
//     throw err;
//   }
//   client.query(sql, function(err, result) {
//     if (err) {
//       throw err;
//     }
//     console.log(result.rows);
//     data = result.rows;
//     client.end();
//   });
// });

// app.get('/admins', function(req, res) {
//   // res.json({notes: "some string"});
//   res.json(data);
// });

// app.listen(4242);

var express = require('express');
var router = express.Router();

var db = require('../queries');

router.get('/api/admins', db.getAllAdmins);
router.get('/api/admins/:id', db.getSingleAdmin);
// router.post('/api/admins', db.createAdmin);
// router.put('/api/admins/:id', db.updateAdmin);
router.delete('/api/admins/:id', db.removeAdmin);

module.exports = router;