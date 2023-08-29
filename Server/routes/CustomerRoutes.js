const Router = require('express')
const router = new Router()
const Customer = require('../models/Customer')
const ArchivedCustomer = require('../models/ArchivedCustomer')
const controller = require('../controllers/customerController')

// Getting customers
router.get('/', controller.getCustomers )

// getting archived customers

router.get('/archive', controller.getArchivedCustomers)

// Creating one
router.post('/', controller.createCustomer)

// Change customer status
router.patch('/status/:id', getCustomer, controller.changeCustomerStatus)

// turn customer to client

router.post('/customerToClient/:id', getCustomer, controller.customerToClient)

// Delete customer
router.delete('/:id', getCustomer, controller.deleteCustomer)

// delete Archived customer

router.delete('/archive/:id', getArchivedCustomer, controller.deleteCustomer)

// archive customer

router.post('/archive/:id', getCustomer, controller.archiveCustomer)

// reactivate customer

router.get('/archive/:id', getArchivedCustomer, controller.reactivateCustomer)

async function getCustomer(req, res, next) {
  let customer
  try {
    customer = await Customer.findById(req.params.id)
    if (customer == null) {
      return res.status(404).json({ message: 'Cannot find customer' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.customer = customer
  next()
}

async function getArchivedCustomer(req, res, next) {
  console.log("it's a hit!!!!!!!!!!!")
  let customer
  try {
    customer = await ArchivedCustomer.findById(req.params.id)
    if (customer == null) {
      return res.status(404).json({ message: 'Cannot find customer bla bla' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.customer = customer
  console.log(customer)
  next()
}

module.exports = router
