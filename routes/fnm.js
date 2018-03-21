const Express = require('express')
const openRouter = Express.Router()
const fnm = require('../fnm')

// openRouter.get('/')

/*
map urls to functions
for time series data
*/
openRouter.get('/fnms', fnm.getFnms)
openRouter.get('/series/:qryfile', fnm.getSeries)
// openRouter.get('/api/series/raw', fnm.getSeriesWithTime)
// openRouter.get('/api/series/raw/:qryfile/:top', fnm.getSeriesWithTime)
// openRouter.get('/api/series/hosts/one', fnm.getOneSeries)
// openRouter.get('/api/series/:series', fnm.getAllSeries);

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
