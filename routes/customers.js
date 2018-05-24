const Express = require('express')
const openRouter = Express.Router()
const customers = require('../customers')
// openRouter.get('/')

/**
map urls to functions
for customers
*/
openRouter.get('/customers', customers.getAllCustomers)
openRouter.get('/customers/:coid', customers.getOneCustomer)
openRouter.post('/customers', customers.createCustomer)
openRouter.delete('/customers/:coid', customers.removeCustomer)
openRouter.get('/customers/:coid/relationships/networks', customers.getCustomerNetworks)
openRouter.get('/customers/:coid/networks', customers.getCustomerNetworks)
openRouter.get('/networks', customers.getAllNetworks)
openRouter.post('/networks', customers.createNetwork)
openRouter.delete('/networks/:netid', customers.removeNetwork)

/*
export express new openRouter object
and its methods
*/
module.exports = openRouter
