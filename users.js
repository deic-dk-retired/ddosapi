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
  var reldata = null
  var sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  // funtion to return networks for each user
  function userNetworks (usrid) {
    return usrid
  }

  var sqlAllUsers = db.miniQuery('.sql/users/allUsers.sql')
  db.foddb.any(sqlAllUsers)
    .then(function (data) {
      // create json api array
      var jsonarr = []
      var jsonobj
      data.map(function (e) {
        jsonobj = {
          type: 'users',
          id: parseInt(e.administratorid),
          links: {
            self: 'http://10.33.1.97:4242/api/users/' + e.administratorid
          },
          relationships: {
            networks: {
              links: {
                self: 'http://10.33.1.97:4242/api/users/' + e.administratorid + '/relationships/networks',
                related: 'http://10.33.1.97:4242/api/users/' + e.administratorid + '/networks'
              },
              data: userNetworks(e.administratorid)
            }
          }
        }
        // remove duplicate id property from attributes
        delete e.administratorid
        jsonobj.attributes = e
        jsonarr.push(jsonobj)
      })

      // show jsonapi
      res.status(200)
      .json({
        data: jsonarr,
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

// uses json api conventions
function getOneUser (req, res, next) {
  var reldata = null
  // fetch user networks
  var sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  db.foddb.any(sqlUserNetworks, {userid: req.params.userid})
  .then(function (data) {
    // create json api array
    var prarr
    if (data.length > 1) {
      prarr = []
      data.map(function (e) {
        prarr.push({
          type: 'networks',
          id: parseInt(e.customernetworkid)
        })
      })
      reldata = prarr
    }
    if (data.length === 1) {
      reldata = {
        type: 'networks',
        id: parseInt(data[0].customernetworkid)
      }
    }
    if (data.length === 0) {
      // null and not []
      reldata = null
    }
    return reldata
  })
  .catch(function (err) {
    console.error(err.stack)
    return next(err.message)
  })

  // fetch user data
  var sqlOneUser = db.miniQuery('.sql/users/oneUser.sql')
  db.foddb.one(sqlOneUser, {userid: req.params.userid})
    .then(function (data) {
      var jsonobj = {
        type: 'users',
        id: parseInt(data.administratorid),
        links: {
          self: 'http://10.33.1.97:4242/api/users/' + data.administratorid
        },
        relationships: {
          networks: {
            links: {
              self: 'http://10.33.1.97:4242/api/users/' + data.administratorid + '/relationships/networks',
              related: 'http://10.33.1.97:4242/api/users/' + data.administratorid + '/networks'
            },
            data: reldata
          }
        }
      }
      // remove duplicate id property from attributes
      delete data.administratorid
      jsonobj.attributes = data
      // show jsonapi
      res.status(200)
      .json({
        data: jsonobj
      })
    })
    .catch(function (err) {
      console.error(err.stack)
      return next(err.message)
    })
}

function getUserNetworks (req, res, next) {
  var sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  db.foddb.any(sqlUserNetworks, {userid: req.params.userid})
    .then(function (data) {
      // create pr api array
      var prarr
      var probj
      if (data.length > 1) {
        prarr = []
        data.map(function (e) {
          probj = {
            type: 'networks',
            id: parseInt(e.customernetworkid)
          }
          // remove duplicate id property from attributes
          delete e.customernetworkid
          probj.attributes = e
          prarr.push(probj)
        })
      }
      if (data.length === 1) {
        console.log(data)
        probj = {
          type: 'networks',
          id: parseInt(data[0].customernetworkid)
        }
        // remove duplicate id property from attributes
        delete data[0].customernetworkid
        probj.attributes = data[0]
        prarr = probj
      }
      if (data.length === 0) {
        prarr = []
      }
      // show prapi
      res.status(200)
      .json({
        links: {
          self: 'http://10.33.1.97:4242/api/networks/' + req.params.userid
        },
        data: prarr
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
  var sqlCreateUser = db.miniQuery('.sql/users/createUser.sql')
  db.foddb.none(sqlCreateUser,
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
  getUserNetworks: getUserNetworks,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
}
