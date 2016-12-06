// var pg = require('pg');
// var pgp = require('pg-promise');

// var connStr = 'postgres:flowuser:Gbr(Ff)wCJOF@localhost/netflow';
// var client = new pg.Client(connStr);
// var sql = "SELECT administratorid as userid, customerid as custid, kind, name, username from flow.administrators where valid = 'TRUE' order by username ASC";
// var data = "";
var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);
var connectionString =  'postgres:flowuser:Gbr(Ff)wCJOF@localhost/netflow';
var db = pgp(connectionString);

function getAllAdmins(req, res, next) {
  db.any("SELECT administratorid as userid, customerid as custid, kind, name, username from flow.administrators where valid = 'TRUE' order by username ASC")
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL Administrators'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleAdmin(req, res, next) {
  var adminID = parseInt(req.params.id);
  db.one("SELECT administratorid as userid, customerid as custid, kind, name, username from flow.administrators where administratorid = $1", adminID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE Administrator'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createAdmin(req, res, next) {
  // req.body.age = parseInt(req.body.age);
  db.none("insert into flow.administrators (customerid, kind, name, phone, username, password, valid, lastlogin, lastpasswordchange)" +
      "values(${customerid}, ${kind}, ${name}, ${phone}, ${username}, crypt(${password}, gen_salt('bf', 10)), true, now(), now())",
    req.body)
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one Administrator'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateAdmin(req, res, next) {
  db.none("update flow.administrators set customerid=$1, kind=$2, name=$3, phone=$4, username=$5, password=crypt($6, gen_salt('bf', 10)) where id=$7",
    [req.body.customerid, req.body.kind, req.body.name, req.body.phone, req.body.username, req.body.password])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Admin'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeAdmin(req, res, next) {
  var adminID = parseInt(req.params.id);
  db.result("delete from flow.administrators where administratorid = $1", adminID)
    .then(function (result) {
      /* jshint ignore:start */
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} puppy`
        });
      /* jshint ignore:end */
    })
    .catch(function (err) {
      return next(err);
    });
}


module.exports = {
  getAllAdmins: getAllAdmins,
  getSingleAdmin: getSingleAdmin,
  createAdmin: createAdmin,
  // updatePuppy: updatePuppy,
  removeAdmin: removeAdmin
};