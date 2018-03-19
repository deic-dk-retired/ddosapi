/**
 * 1. Use a influx query file. Parse and pass the query to curl and retrieve data.
 *    Expose tis function to be used in router.
 * 2. Build dynamic influx queries using influxdb-nodejs api
 */
const db = require('./db')

const getFnms = (req, res, next) => {
  const sqlFnm = db.miniQuery('.sql/misc/allFnm.sql')
  db.foddb.any(sqlFnm)
    .then((d) => {
      res.status(200)
      .json({
        data: d.map((e) => {
          return {
            type: 'fnms',
            id: e.id,
            attributes: {
              fnmid: e.fnmid,
              couuid: e.couuid,
              coid: e.coid
            }
          }
        }),
        meta: {
          total: d.length
        }
      })
    })
    .catch((err) => {
      return next(err.message)
    })
}
/* uses default influx and pull from static query file from given url param */
const getSeries = (req, res, next) => {
  const qryfile = req.params.qryfile + '.sql'
  /**
   * store minified queryfile object into a variable
   * QueryFile { file: "filename.sql", options: {"debug":false,"minify":true,"compress":false}, query: "select * .."}
   */
  const getAllSeries = db.miniQuery('.influxql/' + qryfile)
  db.influxClient.query(getAllSeries.query)
    .then((d) => {
      res.status(200)
      .json({
        series: d,
        meta: {
          total: d.length
        }
      })
    })
    .catch((err) => {
      return next(err.message)
    })
}

const getSeriesWithTime = (req, res, next) => {
  const qryfile = req.params.qryfile + '.sql'
  // var topn = parseInt(req.params.num)
  const getAllSeries = db.miniQuery('.influxql/' + qryfile)
  /**
   * from nth day to n-x days going backwards e.g. 5days ago to 6days ago gives data for 6 days ago thus
   * "tmfrm < tuntil"
   */
  db.influxnodeClient.query(getAllSeries.query)
    .then((data) => {
      res.status(200)
        .json({
          stamp: data,
          meta: {
            total: data.length
          }
        })
    })
    .catch((err) => {
      return next(err.message)
    })
  // db.influxnodeClient.query('hosts')
  //   .where('resource', 'bps')
  //   .where('direction', 'incoming')
  //   .where('time', 'now() - 0', '<')
  //   .where('time', 'now() - 30m', '>')
  //   .addFunction('top', 'value', 20)
  //   .then((data) => {
  //     res.status(200)
  //       .json({
  //         stamp: data,
  //         meta: {
  //           total: data.length
  //         }
  //       })
  //   })
  //   .catch((err) => {
  //     return next(err.message)
  //   })
}

/**
 * use npm influxdb-nodejs to fetch results using queryRaw()
 */
// function getOneSeries (req, res, next) {
//   // var qryfile = req.params.qryfile + '.sql'
//   // var getAllSeries = db.miniQuery('.influxql/' + qryfile)
//   db.influxnodeClient.queryRaw('select max(value::float) from graphite.autogen.hosts where direction = \'incoming\' and time > now() - 25d group by resource, time(5d) order by time desc')
//   .then((data) => {
//     res.status(200)
//     .json({
//       status: 'success',
//       data: data,
//       size: data.length,
//       message: 'Retrieved requested series'
//     })
//   })
//   .catch((err) => {
//     return next(err.message)
//   })
// }

const fnm = {
  getSeries: getSeries,
  getSeriesWithTime: getSeriesWithTime,
  getFnms: getFnms
  // getOneSeries: getOneSeries
}

module.exports = fnm
