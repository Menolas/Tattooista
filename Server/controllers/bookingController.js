const Booking = require('../models/Booking')
const Client = require("../models/Client");
const ArchivedBooking = require("../models/ArchivedBooking");

class bookingController {

  async getBookings (req, res) {
    let page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const status = req.query.status
    const term = req.query.term
    let bookings = []
    const results = {}

    try {
      if (status === 'null' && !term) {
        bookings = await Booking.find().sort({createdAt: -1})
      } else if (status !== 'null' && !term) {
        bookings = await Booking.find({status: status}).sort({createdAt: -1})
      } else if (status !== 'null' && term) {
        bookings = await Booking.find({fullName: {$regex: term, $options: 'i'}, status: status}).sort({createdAt: -1})
      } else if (status === 'null' && term) {
        bookings = await Booking.find({fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      }

      results.resultCode = 0
      results.totalCount = bookings.length
      results.bookings = bookings.slice(startIndex, endIndex)
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      console.log(e)
      res.status(400).json(results)
    }
  }

  async getArchivedBookings (req, res) {
    let page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const status = req.query.status
    const term = req.query.term
    let archivedBookings = []
    const results = {}

    try {
      if (status === 'null' && !term) {
        archivedBookings = await ArchivedBooking.find().sort({createdAt: -1})
      } else if (status !== 'null' && !term) {
        archivedBookings = await ArchivedBooking.find({status: status}).sort({createdAt: -1})
      } else if (status !== 'null' && term) {
        archivedBookings = await ArchivedBooking.find({fullName: {$regex: term, $options: 'i'}, status: status}).sort({createdAt: -1})
      } else if (status === 'null' && term) {
        archivedBookings = await ArchivedBooking.find({fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      }
      results.resultCode = 0
      results.totalCount = archivedBookings.length
      results.bookings = archivedBookings.slice(startIndex, endIndex)
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      console.log(e)
      res.status(400).json({ results })
    }
  }

  async createBooking(req, res) {
    const results = {}
    try {
      const booking = new Booking({
        fullName: req.body.bookingName,
        contacts: {
          email: req.body.mail,
          phone: req.body.phone,
          whatsapp: req.body.whatsapp,
          messenger: req.body.messenger,
          message: req.body.message
        }
      })
      await booking.save()
      results.resultCode = 0
      results.booking = booking
      res.status(201).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      console.log(e)
      res.status(400).json(results)
    }
  }

  async deleteBooking(req, res) {
    const results = {}
    try {
      await res.booking.remove()
      results.resultCode = 0
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(500).json(results)
    }
  }

  async changeBookingStatus(req, res) {
    res.booking.status = !req.body.status
    const results = {}
    try {
      await res.booking.save()
      results.status = res.booking.status
      results.resultCode = 0
      res.json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async bookingToClient(req, res) {
    const client = new Client({
      fullName: req.body.fullName,
      contacts: req.body.contacts
    })
    const results = {}

    try {
      await res.booking.remove()
      await client.save()
      results.client = client
      results.resultCode = 0
      res.status(201).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async archiveBooking(req, res) {
    const archivedBooking = new ArchivedBooking({
      fullName: res.booking.fullName,
      contacts: {
        email: res.booking.contacts.email,
        insta: res.booking.contacts.insta,
        phone: res.booking.contacts.phone,
        whatsapp: res.booking.contacts.whatsapp,
        messenger: res.booking.contacts.messenger
      }
    })

    const results = {}

    try {
      await archivedBooking.save()
      await res.booking.remove()
      results.resultCode = 0
      results.booking = archivedBooking
      res.status(201).json(results)

    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async reactivateBooking(req, res) {
    const booking = new Booking({
      fullName: res.booking.fullName,
      contacts: {
        email: res.booking.contacts.email,
        insta: res.booking.contacts.insta,
        phone: res.booking.contacts.phone,
        whatsapp: res.booking.contacts.whatsapp,
        messenger: res.booking.contacts.messenger
      }
    })

    const results = {}

    try {
      await booking.save()
      await res.booking.remove()
      results.resultCode = 0
      results.booking = booking
      res.status(201).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }
}

module.exports = new bookingController()
