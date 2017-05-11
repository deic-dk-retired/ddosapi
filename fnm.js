// read influx query file
// parse and pass the query to curl
// retrieve data from curl and return
// expose the function to be used in router
var db = require('./db')
/*
uses default influx
and pulls from static query file
from given url param
*/
function getSeries (req, res, next) {
  var qryfile = req.params.qryfile + '.sql'
  var getAllSeries = db.query('../influxql/' + qryfile)
  db.influx.query(getAllSeries.query)
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
  var getAllSeries = db.query('../influxql/' + qryfile)
  db.influx.query(getAllSeries.query, {num: topn, tfrom: req.params.tmfrm, tuntil: req.params.tmto})
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
  // var getAllSeries = db.query('../influxql/' + qryfile)
  db.influx.query('select max(value::float) from graphite.autogen.hosts where direction = \'incoming\' and time > now() - 5d group by resource, time(5h) order by time desc')
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
  var getAllSeries = db.query('../influxql/' + qryfile)
  // console.log(getAllSeries.query);
  db.influx.query(getAllSeries.query)
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
