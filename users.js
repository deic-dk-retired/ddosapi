// connect to db and then get the
// query handler method

var db = require('./db')
// const chalk = require('chalk')
// var db.promise = require('bluebird')

// uses json api conventions
var authenticate = (req, res, next) => {
  var sqlUserAccess = db.miniQuery('.sql/users/userAccess.sql')
  // console.log(chalk.hex('#039BE5')(sqlUserAccess))
  db.foddb.any(sqlUserAccess, {username: req.params.username, password: req.params.password})
    .then((data) => {
      console.log(db.chalk.hex('#039BE5')(data))
      res.status(200)
      .json({
        type: 'users',
        id: parseInt(data.id),
        attributes: data
      })
    })
    .catch((err) => {
      return next(err.message)
    })
}

var auth = (req, res, next) => {
  var sqlUserAccess = db.miniQuery('.sql/users/userAccess.sql')
  db.foddb.any(sqlUserAccess, {username: req.params.username, password: req.params.password})
    .then((data) => {
      res.status(200)
      .json({
        type: 'users',
        id: data.id,
        attributes: data
      })
    })
    .catch((err) => {
      return next(err.message)
    })
}

// uses json api conventions
var getAllUsers = (req, res, next) => {
  var sqlAllUsers = db.miniQuery('.sql/users/allUsers.sql')
  var sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  var jsonarr = []
  var jsonobj = {}
  db.foddb.task('users-task', t => {
    var prUsers = t.any(sqlAllUsers).then(users => {
      return users
    })
    var prUsersNet = prUsers.map(u => {
      var networks = t.any(sqlUserNetworks, {userid: u.administratorid})
      return networks
    })

    return db.promise.all([prUsers, prUsersNet]).then(([u, n]) => {
      var usernets = n.map((e) => {
        var un
        if (e.length > 1) {
          var prarr = []
          e.map((f) => {
            var nobj = {
              type: 'networks',
              id: parseInt(f.customernetworkid)
            }
            delete f.customernetworkid
            nobj.attributes = f
            prarr.push(nobj)
          })
          un = prarr
        }
        if (e.length === 1) {
          un = [{
            type: 'networks',
            id: parseInt(e[0].customernetworkid)
          }]
          delete e[0].customernetworkid
          un[0].attributes = e
        }
        if (e.length === 0) {
          un = []
        }
        return un
      })
      jsonarr = u.map((e, i) => {
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
              data: usernets[i].map((e) => { return { type: e.type, id: e.id } })
            }
          }
        }
        delete e.administratorid
        jsonobj.attributes = e
        return jsonobj
      })
      return {users: jsonarr, inc: usernets.filter((e) => { return e.length > 1 })}
    })
  })
  .then(d => {
    res.status(200)
    .json({
      data: d.users,
      included: d.inc.map((e) => { return e.map((f) => { return f }) })
    })
  })
  .catch(err => {
    console.error(err.stack)
    return next(err.message)
  })
}

/*
  refactor to use tasks with
  parallel db.promises
 */
var _getUsers = (req, res, next) => {
  var sqlAllUsers = db.miniQuery('.sql/users/allUsers.sql')
  var sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  var jsonarr = []
  var jsonobj = {}
  db.foddb.task('users-task', t => {
    var prUsers = t.any(sqlAllUsers).then(users => {
      return users
    })
    var prUsersNet = prUsers.map(u => {
      var networks = t.any(sqlUserNetworks, {userid: u.administratorid})
      return networks
    })

    return db.promise.all([prUsers, prUsersNet]).then(([u, n]) => {
      var usernets = n.map((e) => {
        var un
        if (e.length > 1) {
          var prarr = []
          e.map((f) => {
            var nobj = {
              type: 'networks',
              id: parseInt(f.customernetworkid)
            }
            delete f.customernetworkid
            nobj.attributes = f
            prarr.push(nobj)
          })
          un = prarr
        }
        if (e.length === 1) {
          un = [{
            type: 'networks',
            id: parseInt(e[0].customernetworkid)
          }]
          delete e[0].customernetworkid
          un[0].attributes = e
        }
        if (e.length === 0) {
          un = []
        }
        return un
      })
      jsonarr = u.map((e, i) => {
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
              data: usernets[i].map((e) => { return { type: e.type, id: e.id } })
            }
          }
        }
        delete e.administratorid
        jsonobj.attributes = e
        return jsonobj
      })
      return {users: jsonarr, inc: usernets.filter((e) => { return e.length > 1 })}
    })
  })
  .then(d => {
    res.status(200)
    .json({
      data: d.users,
      included: d.inc
    })
  })
  .catch(err => {
    console.error(err.stack)
    return next(err.message)
  })
}

// uses json api conventions
var getOneUser = (req, res, next) => {
  var sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  var sqlOneUser = db.miniQuery('.sql/users/oneUser.sql')
  var jsonobj = {}
  db.foddb.task('usr-task', t => {
    var users = t.one(sqlOneUser, {userid: req.params.userid}).then(user => {
      return user
    })
    var usernet = users.then(user => {
      var networks = t.any(sqlUserNetworks, {userid: user.administratorid})
      return networks
    })
    return db.promise.all([users, usernet]).then(([u, n]) => {
      var un
      n.forEach(e => {
        e.customernetworkid = parseInt(e.customernetworkid)
        e.customerid = parseInt(e.customerid)
        e.administratorid = parseInt(e.administratorid)
      })
      if (n.length > 1) {
        var prarr = []
        n.map((e) => {
          var nobj = {
            type: 'networks',
            id: e.customernetworkid
          }
          delete e.customernetworkid
          nobj.attributes = e
          prarr.push(nobj)
        })
        un = prarr
      }
      if (n.length === 1) {
        un = [{
          type: 'networks',
          id: n[0].customernetworkid
        }]
        delete n[0].customernetworkid
        un[0].attributes = n[0]
      }
      if (n.length === 0) {
        un = []
      }
      jsonobj = {
        type: 'users',
        id: u.administratorid,
        links: {
          self: 'http://10.33.1.97:4242/api/users/' + u.administratorid
        },
        relationships: {
          networks: {
            links: {
              self: 'http://10.33.1.97:4242/api/users/' + u.administratorid + '/relationships/networks',
              related: 'http://10.33.1.97:4242/api/users/' + u.administratorid + '/networks'
            },
            data: un.map((e) => { return { type: e.type, id: e.id } })
          }
        }
      }
      delete u.administratorid
      jsonobj.attributes = u
      return {user: jsonobj, inc: un}
    })
  })
  .then(d => {
    res.status(200)
    .json({
      data: d.user,
      included: d.inc
    })
  })
  .catch(err => {
    console.error(err.stack)
    return next(err.message)
  })
}

var _getUser = (req, res, next) => {
  var sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  var sqlOneUser = db.miniQuery('.sql/users/oneUser.sql')
  var jsonobj = {}
  db.foddb.task('usr-task', t => {
    var users = t.one(sqlOneUser, {userid: req.params.userid}).then(user => {
      return user
    })
    var usernet = users.then(user => {
      var networks = t.any(sqlUserNetworks, {userid: user.administratorid})
      return networks
    })
    return db.promise.all([users, usernet]).then(([u, n]) => {
      var un
      n.forEach(e => {
        e.customernetworkid = parseInt(e.customernetworkid)
        e.customerid = parseInt(e.customerid)
        e.administratorid = parseInt(e.administratorid)
      })
      if (n.length > 1) {
        var prarr = []
        n.map((e) => {
          var nobj = {
            type: 'networks',
            id: e.customernetworkid
          }
          delete e.customernetworkid
          nobj.attributes = e
          prarr.push(nobj)
        })
        un = prarr
      }
      if (n.length === 1) {
        un = [{
          type: 'networks',
          id: n[0].customernetworkid
        }]
        delete n[0].customernetworkid
        un[0].attributes = n[0]
      }
      if (n.length === 0) {
        un = []
      }
      jsonobj = {
        type: 'users',
        id: u.administratorid,
        links: {
          self: 'http://10.33.1.97:4242/api/users/' + u.administratorid
        },
        relationships: {
          networks: {
            links: {
              self: 'http://10.33.1.97:4242/api/users/' + u.administratorid + '/relationships/networks',
              related: 'http://10.33.1.97:4242/api/users/' + u.administratorid + '/networks'
            },
            data: un.map((e) => { return { type: e.type, id: e.id } })
          }
        }
      }
      delete u.administratorid
      jsonobj.attributes = u
      return {user: jsonobj, inc: un}
    })
  })
  .then(d => {
    res.status(200)
    .json({
      data: d.user,
      included: d.inc
    })
  })
  .catch(err => {
    console.error(err.stack)
    return next(err.message)
  })
}

var getUserNetworks = (req, res, next) => {
  var prarr = null
  var probj = null
  var sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  db.foddb.any(sqlUserNetworks, {userid: req.params.userid})
    .then((data) => {
      // create pr api array
      if (data.length > 1) {
        prarr = []
        data.map((e) => {
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
          self: 'http://10.33.1.97:4242/api/users/' + req.params.userid + '/networks'
        },
        data: prarr
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
}

var updateUser = (req, res, next) => {
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
    .then(() => {
      res.status(200)
      .json({
        meta: {
          status: 'success',
          message: 'User ' + req.body.username + ' modified'
        }
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
}

var createUser = (req, res, next) => {
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
    .then(() => {
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
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
}

var removeUser = (req, res, next) => {
  var sqlDeleteUser = db.miniQuery('.sql/users/deleteUser.sql')
  db.foddb.result(sqlDeleteUser, {username: req.params.username})
    .then((result) => {
      res.status(200)
      .json({
        meta: {
          status: 'success',
          message: 'Removed user: ' + req.params.username
        }
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
}

var users = {
  authenticate: authenticate,
  auth: auth,
  getAllUsers: getAllUsers,
  getOneUser: getOneUser,
  getUserNetworks: getUserNetworks,
  createUser: createUser,
  updateUser: updateUser,
  removeUser: removeUser
}

module.exports = users
