var promise = require('bluebird')
  , options = {
      // Initialization Options
      promiseLib: promise
    }
  , pgp = require('pg-promise')(options)
  , connectStringFod =  'postgres:flowuser:Gbr(Ff)wCJOF@localhost/netflow'
  , fodDb = pgp(connectStringFod);

function sql(file) {
  // consider using here: path.join(__dirname, file)
  console.log(new pgp.QueryFile(file, {minify: true}))
  return new pgp.QueryFile(file, {minify: true});
}

module.exports = {
  foddb : fodDb
, query : sql
};