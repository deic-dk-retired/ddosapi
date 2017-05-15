/**
 * 1. Use a influx query file. Parse and pass the query to curl and retrieve data.
 *    Expose tis function to be used in router.
 * 2. Build dynamic influx queries using influxdb-nodejs api
 */

var db = require('./db')
/* uses default influx and pull from static query file from given url param */
function getSeries (req, res, next) {
  var qryfile = req.params.qryfile + '.sql'
  // store minified queryfile into a variable
  var getAllSeries = db.miniQuery('../influxql/' + qryfile)
  db.influxClient.query(getAllSeries.query)
    .then(function (data) {
      res.status(200)
      .json({
        status: 'success',
        data: data,
        size: data.length,
        message: 'Retrieved requested series from query file'
      })
    })
    .catch(function (err) {
      return next(err.message)
    })
}

function getSeriesWithTime (req, res, next) {
  var qryfile = req.params.qryfile + '.sql'
  var topn = parseInt(req.params.num)
  var getAllSeries = db.miniQuery('../influxql/' + qryfile)
  // from nth day to n-x days going backwards e.g. 5days ago to 6days ago
  // gives data for 6 days ago thus "tmfrm < tuntil"
  // select * from graphite.autogen.hosts where resource='bps' and time < now() - 5d and time > now() - 6d and direction='incoming'
  db.influxnodeClient.query('graphite.autogen.hosts')
    .where('resource', 'bps')
    .where('direction', 'incoming')
  // .where('time', req.params.tmfrm, '<')
  // .where('time', req.params.tmto, '>')
  // .where('direction', 'incoming')
  // .addFunction('top', 'value', topn)
  .then(function (data) {
    res.status(200)
      .json({
        status: 'success',
        data: data,
        size: data.length,
        message: 'Retrieved requested series from query file with time intervals'
      })
  })
    .catch(function (err) {
      return next(err.message)
    })
}

/*
uses npm influxdb-nodejs
*/
function getOneSeries (req, res, next) {
  // var qryfile = req.params.qryfile + '.sql'
  // var getAllSeries = db.miniQuery('../influxql/' + qryfile)
  db.influxClient.query('select max(value::float) from graphite.autogen.hosts where direction = \'incoming\' and time > now() - 5d group by resource, time(5h) order by time desc')
  .then(function (data) {
    res.status(200)
    .json({
      status: 'success',
      data: data,
      size: data.length,
      message: 'Retrieved requested series'
    })
  })
  .catch(function (err) {
    return next(err.message)
  })
}

/*
uses npm influx on static query file
*/
function getGrpSeries (req, res, next) {
  var qryfile = 'qf-hosts-mx-val.sql'
  var getAllSeries = db.miniQuery('../influxql/' + qryfile)
  // console.log(getAllSeries.query);
  db.influxClient.query(getAllSeries.query)
  .then(function (data) {
    // console.log(data);
    res.status(200)
    .json({
      status: 'success',
      data: data,
      size: data.length,
      message: 'Retrieved requested series'
    })
  })
  .catch(function (err) {
    return next(err.message)
  })
}

module.exports = {
  getSeries: getSeries,
  getSeriesWithTime: getSeriesWithTime,
  getOneSeries: getOneSeries,
  getGrpSeries: getGrpSeries
}
