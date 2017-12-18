require('dotenv').config()
const db = require('./db')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const sqlUserAccess = db.miniQuery('.sql/users/userAccess.sql')
  const verUsername = db.miniQuery('.sql/users/isUser.sql')
  const verActiveUser = db.miniQuery('.sql/users/userStatus.sql')

  // console.log(sqlUserAccess)
  // console.log(verUsername)
  // console.log(verActiveUser)
  // console.log(req.body.verUsername)

  db.foddb.any(verUsername, {username: req.body.username})
  .then((d) => {
    if (d.length === 0) { //! user
      res.status(404)
      .json({
        status: '404',
        message: 'no such username'
      })
    } else { // isUser
      return db.foddb.any(verActiveUser, {username: d[0].username})
      .then((d) => {
        console.log(d[0].valid)
        if (d[0].valid === 'active') { // isActive
          return db.foddb.any(sqlUserAccess, {username: req.body.username, password: req.body.password})
          .then((d) => { // password matches
            if (d[0].hasAccess) {
              let payload = {
                ddpsEng: 'fastnetmon',
                clnt: 'deic-ddps',
                usrtype: d.kind,
                co: d.companyname
              }
              let token = jwt.sign(payload, process.env.SU_SEC, {
                expiresIn: '6h', // expires in 6 hours,
                algorithm: 'HS512',
                issuer: 'Ashokaditya, DeIC'
              })
              res.status(200)
              .json({
                type: 'auth',
                token: token,
                data: [{
                  type: 'users',
                  id: d[0].administratorid,
                  links: {
                    self: '/api/users/' + d[0].administratorid
                  }
                }]
              })
            } else {
              res.status(401)
              .json({
                status: '401',
                message: 'Incorrect password!'
              })
            }
          })
          .catch((err) => {
            return next(err.message)
          })
        } else {
          res.status(200)
          .json({
            message: 'Inactive user! Can not log in.'
          })
        }
      })
      .catch((err) => {
        return next(err.message)
      })
    }
  })
  .catch((err) => {
    return next(err.message)
  })

  // db.foddb.any(sqlUserAccess, {username: req.body.username, password: req.body.password})
  //   .then((d) => {
  //     let payload = {
  //       ddpsEng: 'fastnetmon',
  //       clnt: 'deic-ddps',
  //       usrtype: d.kind,
  //       co: d.companyname
  //     }
  //     let token = jwt.sign(payload, process.env.SU_SEC, {
  //       expiresIn: '6h', // expires in 6 hours,
  //       algorithm: 'HS512',
  //       issuer: 'Ashokaditya, DeIC'
  //     })
  //     res.status(200)
  //     .json({
  //       type: 'auth',
  //       token: token
  //     })
  //   })
  //   .catch((err) => {
  //     return next(err.message)
  //   })
}

const users = {
  auth: auth
}

module.exports = users
