// read influx query file
// parse and pass the query to curl
// retrieve data from curl and return
// expose the function to be used in router
var db = require('./db');
// var path = require('path');
// var fs = require('fs');
var got = require('got');
// var request = require("request");
var influxurl = "http://172.22.89.2:8086/query"
  , qpar = "?q="
  // , querystr
  ;
//read json data from fastnetmon instance
//using curl or something similar
//catch the json output pass it on here.
// function getSeries(req, res, next) {
//   var str;
//   var file = req.params.series +'.txt';
//   str = buildQueryStr(file);
//   got(str)
//     .then(function (data) {
//       var dataObj = JSON.parse(data.body);
//       // console.log("data type: " + (typeof dataObj) );
//       res.status(200)
//       .json({
//         status: 'success',
//         message: 'Retrieved requested series',
//         data: dataObj["results"][0]["series"]
//       });
//     })
//     .catch(function (err) {
//       return next(err.message);
//     });
// }

function getSeries(req, res, next) {
  var qryfile = req.params.qryfile + '.sql';
  var getAllSeries = db.query('../influxql/' + qryfile);
  // var querystr = influxurl + qpar + getAllSeries["query"];
  // console.log(querystr)
  // got(querystr)
  //   .then(function (data) {
  //     var dataObj = JSON.parse(data.body)["results"][0]["series"];
  //     res.status(200)
  //       .json({
  //         status: 'success',
  //         data: dataObj,
  //         message: 'Retrieved requested series'
  //       });
  //   })
  //   .catch(function (err) {
  //     return next(err.message);
  //   });
  db.influx.query(getAllSeries)
    .then(function (data) {
      var dataObj = JSON.parse(data.body)["results"][0]["series"];
      res.status(200)
      .json({
          status: 'success',
          data: dataObj,
          message: 'Retrieved requested series'
        });
      // res.json(result);
    })
    .catch(function (err) {
      // res.status(500).send(err.stack)
      return next(err.message);
    })
}

//uses npm influx
function getGrpSeries(req, res, next) {
  var qryfile = 'hostsmaxvalues.sql';
  var getAllSeries = db.query('../influxql/' + qryfile);
  // console.log(getAllSeries.query);
  db.influx.query(getAllSeries.query)
  .then(function (data){
    // console.log(data);
    res.status(200)
    .json({
        status: 'success',
        data: data,
        message: 'Retrieved requested series'
      });
  })
  .catch(function (err) {
    return next(err.message);
  })
}

// uses npm influxdb-nodejs
function getOneSeries(req, res, next) {
  var qryfile = req.params.qryfile + '.sql';
  var measure = req.params.measure;
  var tag = req.params.resource;
  var getAllSeries = db.query('../influxql/' + qryfile);
  db.influx.query('select max(value::float) from graphite.autogen.hosts where direction = \'incoming\' and time > now() - 5d group by resource, time(5h) order by time desc')
  .then(function (data){
    // console.log(data);
    res.status(200)
    .json({
        status: 'success',
        data: data,
        message: 'Retrieved requested series'
      });
  })
  .catch(function (err) {
    return next(err.message);
  })
}

module.exports = {
    getSeries: getSeries
  // , getOneSeries: getOneSeries
  , getGrpSeries: getGrpSeries
};