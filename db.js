var promise = require('bluebird')
var options = {
      // Initialization Options
  promiseLib: promise
}
var pgp = require('pg-promise')(options)
var connectStringFod = 'postgres:flowuser:Gbr(Ff)wCJOF@localhost/netflow'
var fodDb = pgp(connectStringFod)

var Influx = require('influx')
var influx = new Influx.InfluxDB({
  host: '172.22.89.2',
  database: 'graphite'
})

var Influxnode = require('influxdb-nodejs')
var client = new Influxnode('http://172.22.89.2:8086/graphite')

// check for db graphite
// on influxdb
influx.getDatabaseNames()
.then(function (names) {
  if (!names.includes('graphite')) {
    console.log('graphite not found')
  } else {
    console.log('Listening on ' + names[0])
  }
})
.catch(function (err) {
  console.error('Error looking up graphite!')
  return err.message
})

function query (file) {
  // consider using here: path.join(__dirname, file)
  return new pgp.QueryFile(file, {minify: true})
}

module.exports = {
  foddb: fodDb,
  influx: influx,
  graphite: client,
  query: query
}
