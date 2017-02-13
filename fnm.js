// read influx query file
// parse and pass the query to curl
// retrieve data from curl and return
// expose the function to be used in router
var db = require('./db');

var path = require('path');
var fs = require('fs');
var got = require('got');
var request = require("request");

var influxurl = "http://172.22.89.2:8086/query"
  , qpar = "?q="
  , querystr;

//read json data from fastnetmon instance
//using curl or something similar
//catch the json output pass it on here.
function getSeries(req, res, next) {
  var str;
  var file = req.params.series +'.txt';
  str = buildQueryStr(file);
  got(str)
    .then(function (data) {
      var dataObj = JSON.parse(data.body);
      // console.log("data type: " + (typeof dataObj) );
      res.status(200)
      .json({
        status: 'success',
        message: 'Retrieved requested series',
        data: dataObj["results"][0]["series"]
      });
    })
    .catch(function (err) {
      return next(err.message);
    });
}

function getAllSeries(req, res, next) {
  var file = req.params.series + '.sql';
  var getAllSeries = db.query('../influxql/' + file);
  querystr = influxurl + qpar + getAllSeries["query"];
  console.log(querystr)
  got(querystr)
    .then(function (data) {
      var dataObj = JSON.parse(data.body);
      res.status(200)
        .json({
          status: 'success',
          data: dataObj["results"][0]["series"],
          message: 'Retrieved requested series'
        });
    })
    .catch(function (err) {
      return next(err.message);
    });
}

// function buildQueryStr(file){
//   console.log(file);
//   // var querystr;
//   fs.readFile(file, 'utf8', function (err, fdata) {
//     if (err) {throw err};
//     querystr = influxurl + qpar + fdata;
//   });
//   // filestr.close();
//   // console.log("querystr: " + filestr.querystr);
//   return filestr.querystr;
// }

module.exports = {
  getSeries: getSeries
, getAllSeries: getAllSeries
};