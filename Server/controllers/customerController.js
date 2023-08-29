const Customer = require('../models/Customer')
const Client = require("../models/Client");
const ArchivedCustomer = require("../models/ArchivedCustomer");

class customerController {

  async getCustomers (req, res) {
    let page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const status = req.query.status
    const term = req.query.term
    let customers = []
    const results = {}

    try {
      if (status === 'null' && !term) {
        customers = await Customer.find().sort({createdAt: -1})
      } else if (status !== 'null' && !term) {
        customers = await Customer.find({status: status}).sort({createdAt: -1})
      } else if (status !== 'null' && term) {
        customers = await Customer.find({fullName: {$regex: term, $options: 'i'}, status: status}).sort({createdAt: -1})
      } else if (status === 'null' && term) {
        customers = await Customer.find({fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      }

      results.resultCode = 0
      results.totalCount = customers.length
      results.customers = customers.slice(startIndex, endIndex)
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      console.log(err)
      res.status(400).json({ results })
    }
  }

  async getArchivedCustomers (req, res) {
    let page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const status = req.query.status
    const term = req.query.term
    let archivedCustomers = []
    const results = {}

    try {
      if (status === 'null' && !term) {
        archivedCustomers = await ArchivedCustomer.find().sort({createdAt: -1})
      } else if (status !== 'null' && !term) {
        archivedCustomers = await ArchivedCustomer.find({status: status}).sort({createdAt: -1})
      } else if (status !== 'null' && term) {
        archivedCustomers = await ArchivedCustomer.find({fullName: {$regex: term, $options: 'i'}, status: status}).sort({createdAt: -1})
      } else if (status === 'null' && term) {
        archivedCustomers = await ArchivedCustomer.find({fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      }
      results.resultCode = 0
      results.totalCount = archivedCustomers.length
      results.customers = archivedCustomers.slice(startIndex, endIndex)
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      console.log(err)
      res.status(400).json({ results })
    }
  }

  async createCustomer(req, res) {
    const customer = new Customer({
      fullName: req.body.name,
      message: req.body.message
    });

    customer.contacts = { ...{ [req.body.contact]: req.body.contactValue }}
    const results = {}

    try {
      await customer.save()
      results.resultCode = 0
      results.customer = customer
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      console.log(err)
      res.status(400).json(results)
    }
  }

  async deleteCustomer(req, res) {
    const results = {}

    try {
      await res.customer.remove()
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }

  async changeCustomerStatus(req, res) {
    res.customer.status = !req.body.status
    const results = {}
    try {
      await res.customer.save()
      results.status = res.customer.status
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async customerToClient(req, res) {
    const client = new Client({
      fullName: req.body.fullName,
      contacts: req.body.contacts
    })
    const results = {}

    try {
      await res.customer.remove()
      await client.save()
      results.client = client
      results.resultCode = 0
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async archiveCustomer(req, res) {
    const archivedCustomer = new ArchivedCustomer({
      fullName: res.customer.fullName,
      contacts: {
        email: res.customer.contacts.email,
        insta: res.customer.contacts.insta,
        phone: res.customer.contacts.phone,
        whatsapp: res.customer.contacts.whatsapp,
        messenger: res.customer.contacts.messenger
      }
    })

    const results = {}

    try {
      await archivedCustomer.save()
      await res.customer.remove()
      results.resultCode = 0
      results.customer = archivedCustomer
      res.status(201).json(results)

    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async reactivateCustomer(req, res) {
    const customer = new Customer({
      fullName: res.customer.fullName,
      contacts: {
        email: res.customer.contacts.email,
        insta: res.customer.contacts.insta,
        phone: res.customer.contacts.phone,
        whatsapp: res.customer.contacts.whatsapp,
        messenger: res.customer.contacts.messenger
      }
    })

    const results = {}

    try {
      await customer.save()
      await res.customer.remove()
      results.resultCode = 0
      results.customer = customer
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }
}

module.exports = new customerController()
