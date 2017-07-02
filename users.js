// connect to db and then get the
// query handler method
var db = require('./db')

function verifyAccess (req, res, next) {
  var sqlUserAccess = db.miniQuery('.sql/UserAccess.sql')
  db.foddb.one(sqlUserAccess, {usr: req.params.usr, pwd: req.params.pass})
    .then(function (data) {
      res.status(200)
      .json({
        users: data
      })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

function getAllUsers (req, res, next) {
  var sqlAllUsers = db.miniQuery('.sql/allUsers.sql')
  db.foddb.any(sqlAllUsers)
    .then(function (data) {
      res.status(200)
      .json({
        users: data,
        meta: {
          total: data.length
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function getOneUser (req, res, next) {
  var sqlOneUser = db.miniQuery('.sql/oneUser.sql')
  db.foddb.one(sqlOneUser, {usr: req.params.usr})
    .then(function (data) {
      res.status(200)
      .json({users: data})
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function createUser (req, res, next) {
  var sqlInsertUser = db.miniQuery('.sql/insertUser.sql')
  db.foddb.none(sqlInsertUser,
    { custid: parseInt(req.body.custid),
      usrtype: req.body.usrtype,
      usrname: req.body.usrname,
      usrphone: req.body.usrphone,
      usr: req.body.usr,
      pwd: req.body.pwd
    })
    .then(function () {
      res.status(200)
      .json({
        meta: {
          status: 'success',
          message: 'Inserted one User'
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function updateUser (req, res, next) {
  var sqlUpdateUser = db.miniQuery('.sql/updateUser.sql')
  db.foddb.none(sqlUpdateUser,
    { custid: parseInt(req.body.custid),
      usrtype: req.body.type,
      usrname: req.body.fullname,
      usrphone: req.body.userphone,
      usr: req.body.username,
      pwd: req.body.password
    })
    .then(function () {
      res.status(200)
      .json({
        meta: {
          status: 'success',
          message: 'User modified'
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function removeUser (req, res, next) {
  var sqlDeleteUser = db.miniQuery('.sql/deleteUser.sql')
  db.foddb.result(sqlDeleteUser, {usr: req.params.usr})
    .then(function (result) {
      res.status(200)
      .json({
        meta: {
          status: 'success',
          message: 'Removed ' + result.rowCount + ' User'
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

module.exports = {
  verifyAccess: verifyAccess,
  getAllUsers: getAllUsers,
  getOneUser: getOneUser,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
}
