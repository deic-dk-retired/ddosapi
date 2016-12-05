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
  db.one('SELECT administratorid as userid, customerid as custid, kind, name, username from flow.administrators where administratorid = $1', adminID)
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

// function createAdmin(req, res, next) {
//   req.body.age = parseInt(req.body.age);
//   db.none('insert into pups(name, breed, age, sex)' +
//       'values(${name}, ${breed}, ${age}, ${sex})',
//     req.body)
//     .then(function () {
//       res.status(200)
//         .json({
//           status: 'success',
//           message: 'Inserted one puppy'
//         });
//     })
//     .catch(function (err) {
//       return next(err);
//     });
// }

// function updateAdmin(req, res, next) {
//   db.none('update pups set name=$1, breed=$2, age=$3, sex=$4 where id=$5',
//     [req.body.name, req.body.breed, parseInt(req.body.age),
//       req.body.sex, parseInt(req.params.id)])
//     .then(function () {
//       res.status(200)
//         .json({
//           status: 'success',
//           message: 'Updated puppy'
//         });
//     })
//     .catch(function (err) {
//       return next(err);
//     });
// }

function removeAdmin(req, res, next) {
  var adminID = parseInt(req.params.id);
  db.result('delete from flow.administrators where administratorid = $1', adminID)
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
  // createPuppy: createPuppy,
  // updatePuppy: updatePuppy,
  removeAdmin: removeAdmin
};