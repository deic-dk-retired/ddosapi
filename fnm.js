// read influx query file
// parse and pass the query to curl
// retrieve data from curl and return
// expose the function to be used in router

var path = require('path');
var fs = require('fs');
var got = require('got');
var curlToNode = require('curl-to-node');

var queryapi = "http://172.22.89.2:8086/query"
  // , influxql = ""
  , urlquery = "q="
  , curlstr;

function curlStr(file){
  // console.log("file: " + file);
  fs.readFile(file, 'utf8', function (err, fdata) {
    if (err) {throw err};
    // influxql = fdata;
    curlstr = 'curl -G '+ '\'' + queryapi + '\'' + ' --data-urlencode ' + '\"' + urlquery + fdata + '\"';
  });
  // console.log("influxql: " + influxql);
  console.log("curlstr: " + curlstr);
  return curlstr;
}

//read json data from fastnetmon instance
//using curl or something similar
//catch the json output pass it on here.
function getSeries(req, res, next) {
  var file = req.params.series +'.txt';
  var str = curlStr(file);
  got.apply(got, curlToNode('got', str ))
    .then(response => {
      response.status(200);
      console.log("response: "+response.body);
    })
    .catch(error => {
      console.log("err: "+error.response.body);
    });
  // got(queryapi)
  //   .then(function (data) {
  //     // console.log("queryapi th: " + urlquery);
  //     res.status(200)
  //        .json({
  //         status: 'success',
  //         data: data,
  //         message: 'Retrieved requested series'
  //       });
  //   })
  //   .catch(function (err) {
  //     // console.log("queryapi er: " + urlquery);
  //     return next(err.message);
  //   });
}

module.exports = {
  getSeries: getSeries
// ,
};