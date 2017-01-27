//connect to db and then get the
//query handler method
var db = require('./db');

//read json data from fastnetmon instance
//using curl or something similar
//catch the json output pass it on here.
function getSeries(req, res, next) {
  var sqlGetSeries = db.query('../sql/getSeries.sql');
  db.foddb.any(sqlGetAllRules)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved all rules'
        });
    })
    .catch(function (err) {
      return next(err.message);
    });
}
module.exports = {
  getSeries: getSeries
// ,
};