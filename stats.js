const db = require('./db')

const getStats = (req, res, next) => {
  const sqlStats = db.miniQuery('.sql/stats/userStats.sql')
  db.foddb.one(sqlStats, {userid: req.params.userid})
    .then((data) => {
      res.status(200)
      .json({
        data
      })
    })
    .catch((err) => {
      return next(err.message)
    })
}

const stats = {
  getStats
}

module.exports = stats
