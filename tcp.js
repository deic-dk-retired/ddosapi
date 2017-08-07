// connect to db and then get the
// query handler method
var db = require('./db')

function getTcps (req, res, next) {
  var allTcp = db.miniQuery('.sql/allTcps.sql')
  db.foddb.any(allTcp)
    .then(function (data) {
      res.status(200)
      .json({
        tcps: data,
        meta: {
          total: data.length
        }
      })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

module.exports = {
  getTcps: getTcps
}
