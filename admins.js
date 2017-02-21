//connect to db and then get the
//query handler method
var db = require('./db');

function verifyAccess(req, res, next) {
  var sqlAdminAccess = db.query('../sql/adminAccess.sql');
  db.foddb.one(sqlAdminAccess, {usr: req.params.usr, pwd: req.params.pass})
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Compared username'
        });
    })
    .catch(function (err) {
      return next(err.message);
    });
}

function getAllAdmins(req, res, next) {
  var sqlAllAdmins = db.query('../sql/allAdmins.sql');
  db.foddb.any(sqlAllAdmins)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL Administrators'
        });
    })
    .catch(function (err) {
      console.error(err.stack);
      return next(err.message);
    });
}

function getOneAdmin(req, res, next) {
  var sqlOneAdmin = db.query('../sql/oneAdmin.sql');
  // console.log(sqlOneAdmin);
  db.foddb.one(sqlOneAdmin, {usr: req.params.usr})
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE Administrator'
        });
    })
    .catch(function (err) {
      console.error(err.stack);
      return next(err.message);
    });
}

function createAdmin(req, res, next) {
  var sqlInsertAdmin = db.query('../sql/insertAdmin.sql');
  db.foddb.none(sqlInsertAdmin,
            { custid: parseInt(req.body.custid),
              usrtype: req.body.usrtype,
              usrname: req.body.usrname,
              usrphone: req.body.usrphone,
              usr: req.body.usr,
              pwd: req.body.pwd
            }
          )
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted one Administrator'
        });
    })
    .catch(function (err) {
      console.error(err.stack);
      return next(err.message);
    });
}

function updateAdmin(req, res, next) {
  var sqlUpdateAdmin = db.query('../sql/updateAdmin.sql');
  db.foddb.none(sqlUpdateAdmin,
            { custid: parseInt(req.body.custid),
              usrtype: req.body.type,
              usrname: req.body.fullname,
              usrphone: req.body.userphone,
              usr: req.body.username,
              pwd: req.body.password
            }
          )
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated Admin'
        });
    })
    .catch(function (err) {
      console.error(err.stack);
      return next(err.message);
    });
}

function removeAdmin(req, res, next) {
  var sqlDeleteAdmin = db.query('../sql/deleteAdmin.sql');
  db.foddb.result(sqlDeleteAdmin, {usr: req.params.usr})
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: 'Removed '+result.rowCount+' admin'
        });
    })
    .catch(function (err) {
      console.error(err.stack);
      return next(err.message);
    });
}

module.exports = {
  verifyAccess: verifyAccess
, getAllAdmins: getAllAdmins
, getOneAdmin: getOneAdmin
, createAdmin: createAdmin
, updateAdmin: updateAdmin
, removeAdmin: removeAdmin
};