// read influx query file
// parse and pass the query to curl
// retrieve data from curl and return
// expose the function to be used in router

var path = require('path');
var fs = require('fs');
// var rp = require('request-promise');
var got = require('got');
var queryapi = 'http://172.22.89.2:8086/query?q=';
// const Influx = require('influxdb-nodejs');
// const client = new Influx('http://172.22.89.2:8086/graphite');

//read json data from fastnetmon instance
//using curl or something similar
//catch the json output pass it on here.
function getSeries(req, res, next) {
  var file = req.params.series +'.txt';
  var influxql;
  console.log("file: " + file);
  var influxql = fs.readFile(file, 'utf8', function (err, fdata) {
    if (err) {throw err};
    influxql = fdata;
    // console.log("fdata: " + fdata);
    console.log("influxql: " + influxql);
    queryapi += influxql;
  });

  // var options = {
  //     uri: queryapi,
  //     headers: {
  //         'User-Agent': 'Request-Promise'
  //     },
  //     json: true // Automatically parses the JSON string in the response
  // };

  // rp(options)
  //   .then(function (data) {
  //     res.status(200)
  //     console.log(data);
  //   })
  //   .catch(function (err) {
  //     return next(err.message);
  //   });

  got(queryapi)
    .then(function (data) {
      console.log("queryapi: " + queryapi);
      res.status(200)
         .json({
          status: 'success',
          data: data,
          message: 'Retrieved requested series'
        });
    })
    .catch(function (err) {
      console.log("queryapi: " + queryapi);
      return next(err.message);
    });
}
module.exports = {
  getSeries: getSeries
// ,
};