// connect to db and then get the
// query handler method
var db = require('./db')

function getTcps (req, res, next) {
  var allTcp = db.miniQuery('.sql/misc/allTcps.sql')
  db.foddb.any(allTcp)
    .then(function (data) {
      // show jsonapi
      res.status(200)
      .json({
        data: data.map(function (e) {
          return {
            type: 'tcps',
            id: e.id,
            attributes: {
              flag: e.flag,
              desc: e.desc
            }
          }
        }),
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
