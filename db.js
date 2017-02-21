var promise = require('bluebird')
  , options = {
      // Initialization Options
      promiseLib: promise
    }
  , pgp = require('pg-promise')(options)
  , connectStringFod =  'postgres:flowuser:Gbr(Ff)wCJOF@localhost/netflow'
  , fodDb = pgp(connectStringFod);

var Influx = require('influx');
var influx = new Influx.InfluxDB({
  host: '172.22.89.2',
  database: 'graphite'
});

var influxnode = require('influxdb-nodejs');
var client = new influxnode('http://172.22.89.2:8086/graphite');

//check for db graphite
//on influxdb
influx.getDatabaseNames()
.then(names => {
  if (!names.includes('graphite')) {
    console.log('graphite not found');
  }
  else{
    console.log('Listening on '+names[0]);
  }
})
.catch(err => {
  console.error('Error looking up graphite!');
});

client.query('hosts')
  .where('direction', 'incoming')
  .addFunction('count', 'value')
  .then(console.info)
  .catch(console.error);

function sql(file) {
  // consider using here: path.join(__dirname, file)
  // console.log(new pgp.QueryFile(file, {minify: true}))
  return new pgp.QueryFile(file, {minify: true});
}

module.exports = {
  foddb : fodDb
, influx: influx
, graphite: client
, query : sql
};