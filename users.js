const db = require('./db')
const url = 'http://10.33.1.97:4242/api/users/'

const authenticate = (req, res, next) => {
  const sqlUserAccess = db.miniQuery('.sql/users/userAccess.sql')
  db.foddb.any(sqlUserAccess, {username: req.params.username, password: req.params.password})
    .then((data) => {
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

const auth = (req, res, next) => {
  const sqlUserAccess = db.miniQuery('.sql/users/userAccess.sql')
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

const getAllUsers = (req, res, next) => {
  const sqlAllUsers = db.miniQuery('.sql/users/allUsers.sql')
  const sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  let jsonarr = []
  let jsonobj = {}
  let isQueried = false
  if (req.query.include === 'networks') {
    isQueried = true
  }
  db.foddb.tx(t => {
    let txs = []
    const prUsers = t.any(sqlAllUsers).then(users => {
      return users
    })
    txs.push(prUsers)
    if (isQueried) {
      const prUsersNet = prUsers.map(u => {
        const networks = t.any(sqlUserNetworks, {userid: u.administratorid})
        return networks
      })
      txs.push(prUsersNet)
    }
    return db.promise.all(txs).then((args) => {
      const u = args[0]
      if (isQueried) {
        const n = args[1]
        var usernets = n.map((e) => {
          let un = []
          if (e.length > 1) {
            let prarr = []
            e.map((f) => {
              let nobj = {
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
      }
      jsonarr = u.map((e, i) => {
        jsonobj = {
          type: 'users',
          id: parseInt(e.administratorid),
          links: {
            self: url + e.administratorid
          }
        }
        if (isQueried) {
          jsonobj.relationships = {
            networks: {
              links: {
                self: url + e.administratorid + '/relationships/networks',
                related: url + e.administratorid + '/networks'
              },
              data: usernets[i].map((e) => { return { type: e.type, id: e.id } })
            }
          }
        }
        delete e.administratorid
        jsonobj.attributes = e
        return jsonobj
      })
      if (isQueried) {
        return {
          users: jsonarr,
          inc: usernets.filter((e) => { return e.length > 1 })
        }
      } else {
        return {
          users: jsonarr
        }
      }
    })
  })
  .then(d => {
    if (isQueried) {
      let inc = d.inc.reduce((a, b) => { return a.concat(b) })
      let mapped = inc.map(function (e, i) {
        return { i: i, value: e.id }
      })
      mapped.sort(function (a, b) {
        if (a.value > b.value) {
          return 1
        }
        if (a.value < b.value) {
          return -1
        }
        return 0
      })
      let sortinc = mapped.map((e) => {
        return inc[e.i]
      })
      var uniq = sortinc.filter((item, index, self) => { return self.findIndex(obj => { return obj.id === item.id }) === index })
    }
    res.status(200)
    if (isQueried) {
      res.json({
        data: d.users,
        included: uniq
      })
    } else {
      res.json({
        data: d.users
      })
    }
  })
  .catch(err => {
    console.error(err.stack)
    return next(err.message)
  })
}

const getOneUser = (req, res, next) => {
  const sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  const sqlOneUser = db.miniQuery('.sql/users/oneUser.sql')
  let jsonobj = {}
  let isQueried = false
  if (req.query.include === 'networks') {
    isQueried = true
  }
  db.foddb.tx(t => {
    let txs = []
    const users = t.one(sqlOneUser, {userid: req.params.userid}).then(user => {
      return user
    })
    txs.push(users)
    if (isQueried) {
      const usernet = users.then(user => {
        let networks = t.any(sqlUserNetworks, {userid: user.administratorid})
        return networks
      })
      txs.push(usernet)
    }
    return db.promise.all(txs).then((args) => {
      const u = args[0]
      if (isQueried) {
        var un = []
        const n = args[1]
        n.forEach(e => {
          e.customernetworkid = parseInt(e.customernetworkid)
          e.customerid = parseInt(e.customerid)
          e.administratorid = parseInt(e.administratorid)
        })
        if (n.length > 1) {
          let prarr = []
          n.map((e) => {
            let nobj = {
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
      }
      jsonobj = {
        type: 'users',
        id: u.administratorid,
        links: {
          self: url + u.administratorid
        }
      }
      if (isQueried) {
        jsonobj.relationships = {
          networks: {
            links: {
              self: url + u.administratorid + '/relationships/networks',
              related: url + u.administratorid + '/networks'
            },
            data: un.map((e) => { return { type: e.type, id: e.id } })
          }
        }
      }
      delete u.administratorid
      jsonobj.attributes = u
      if (isQueried) {
        return {user: jsonobj, inc: un}
      } else {
        return {user: jsonobj}
      }
    })
  })
  .then(d => {
    res.status(200)
    if (isQueried) {
      res.json({
        data: d.user,
        included: d.inc
      })
    } else {
      res.json({
        data: d.user
      })
    }
  })
  .catch(err => {
    console.error(err.stack)
    return next(err.message)
  })
}

const getUserNetworks = (req, res, next) => {
  var prarr = null
  var probj = null
  var sqlUserNetworks = db.miniQuery('.sql/customers/userNetworks.sql')
  db.foddb.any(sqlUserNetworks, {userid: req.params.userid})
    .then((data) => {
      if (data.length > 1) {
        prarr = []
        data.map((e) => {
          probj = {
            type: 'networks',
            id: parseInt(e.customernetworkid)
          }
          delete e.customernetworkid
          probj.attributes = e
          prarr.push(probj)
        })
      }
      if (data.length === 1) {
        probj = {
          type: 'networks',
          id: parseInt(data[0].customernetworkid)
        }
        delete data[0].customernetworkid
        probj.attributes = data[0]
        prarr = probj
      }
      if (data.length === 0) {
        prarr = []
      }
      res.status(200)
      .json({
        links: {
          self: url + req.params.userid + '/networks'
        },
        data: prarr
      })
    })
    .catch((err) => {
      console.error(err.stack)
      return next(err.message)
    })
}

const updateUser = (req, res, next) => {
  const sqlUpdateUser = db.miniQuery('.sql/users/updateUser.sql')
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

const createUser = (req, res, next) => {
  const sqlCreateUser = db.miniQuery('.sql/users/createUser.sql')
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
      res.status(201)
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

const removeUser = (req, res, next) => {
  const sqlDeleteUser = db.miniQuery('.sql/users/deleteUser.sql')
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

const users = {
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
