// connect to db and then get the
// query handler method
const db = require('./db')

const getTcps = (req, res, next) => {
  const allTcp = db.miniQuery('.sql/misc/allTcps.sql')
  db.foddb.any(allTcp)
    .then((data) => {
      // show jsonapi
      res.status(200)
      .json({
        data: data.map((e) => {
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
    .catch((err) => {
      return next(err.message)
    })
}

module.exports = {
  getTcps: getTcps
}
