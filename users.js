// connect to db and then get the
// query handler method

var db = require('./db')
const chalk = require('chalk')

// uses json api conventions
function authenticate (req, res, next) {
  var sqlUserAccess = db.miniQuery('.sql/users/userAccess.sql')
  // console.log(chalk.hex('#039BE5')(sqlUserAccess))
  db.foddb.any(sqlUserAccess, {username: req.params.username, password: req.params.password})
    .then(function (data) {
      console.log(chalk.hex('#039BE5')(data))
      res.status(200)
      .json({
        type: 'users',
        id: parseInt(data.id),
        attributes: data
      })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

function auth (req, res, next) {
  var sqlUserAccess = db.miniQuery('.sql/users/userAccess.sql')
  db.foddb.any(sqlUserAccess, {username: req.params.username, password: req.params.password})
    .then(function (data) {
      res.status(200)
      .json({
        type: 'users',
        id: data.id,
        attributes: data
      })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

// uses json api conventions
function getAllUsers (req, res, next) {
  var sqlAllUsers = db.miniQuery('.sql/users/allUsers.sql')
  db.foddb.any(sqlAllUsers)
    .then(function (data) {
      // create json api array
      var jsonarr = []
      data.map(function (e) {
        jsonarr.push({
          type: 'users',
          id: parseInt(e.administratorid),
          attributes: e
        })
      })
      // show jsonapi
      res.status(200)
      .json({
        data: jsonarr
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

// uses json api conventions
function getOneUser (req, res, next) {
  var sqlOneUser = db.miniQuery('.sql/users/oneUser.sql')
  db.foddb.one(sqlOneUser, {userid: req.params.userid})
    .then(function (data) {
      // show jsonapi
      res.status(200)
      .json({
        data: {
          type: 'users',
          id: parseInt(data.administratorid),
          attributes: data
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function updateUser (req, res, next) {
  // fetch user details before updating
  var sqlUpdateUser = db.miniQuery('.sql/users/updateUser.sql')
  db.foddb.any(sqlUpdateUser,
    { customerid: parseInt(req.body.customerid),
      kind: req.body.kind,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      userid: parseInt(req.params.userid)
    })
    .then(function () {
      res.status(200)
      .json({
        meta: {
          status: 'success',
          message: 'User ' + req.body.username + ' modified'
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function createUser (req, res, next) {
  var sqlInsertUser = db.miniQuery('.sql/users/createUser.sql')
  db.foddb.none(sqlInsertUser,
    { customerid: parseInt(req.body.customerid),
      kind: req.body.kind,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    })
    .then(function () {
      res.status(200)
      .json({
        meta: {
          status: 'successfully created user',
          message: {
            user: req.body.name,
            username: req.body.username,
            access: req.body.kind
          }
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function removeUser (req, res, next) {
  var sqlDeleteUser = db.miniQuery('.sql/users/deleteUser.sql')
  db.foddb.result(sqlDeleteUser, {username: req.params.username})
    .then(function (result) {
      res.status(200)
      .json({
        meta: {
          status: 'success',
          message: 'Removed user: ' + req.params.username
        }
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

module.exports = {
  authenticate: authenticate,
  auth: auth,
  getAllUsers: getAllUsers,
  getOneUser: getOneUser,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
}
