const Booking = require('../models/Booking');
const ArchivedBooking = require("../models/ArchivedBooking");
const BookingService = require('../services/bookingService');
const mailService = require("../services/mailService");

class bookingController {

  async getBookings (req, res) {
    const results = {};

    if (!req.hasRole) {
        return res.status(403).json({ message: "You don't have permission" });
    }

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const status = req.query.status;
    const term = req.query.term;
    let bookings = [];

    try {
      let query = {};
      let searchConditions = [];

      if (term) {
        const regexSearch = { $regex: term, $options: 'i' };
        searchConditions = [
          { fullName: regexSearch },
          { 'contacts.email': regexSearch },
          { 'contacts.phone': regexSearch },
          { 'contacts.whatsapp': regexSearch },
          { 'contacts.messenger': regexSearch },
          { 'contacts.insta': regexSearch },
        ];
      }

      if (status !== 'any') {
        query = { ...query, status: status };
      }

      if (searchConditions.length > 0) {
        query = { ...query, $or: searchConditions };
      }

      bookings = await Booking.find(query).sort({ createdAt: -1 });
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      results.resultCode = 0;
      results.totalCount = bookings.length;
      results.bookings = bookings.slice(startIndex, endIndex);
      res.json(results);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Server error" });
    }
  }

  async getBooking(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};
    try {
      results.resultCode = 0;
      results.booking = res.booking;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async getArchivedBookings (req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    let page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const status = req.query.status;
    const term = req.query.term;
    let archivedBookings = [];
    const results = {};

    try {
      let query = {};
      let searchConditions = [];

      if (term) {
        const regexSearch = { $regex: term, $options: 'i' };
        searchConditions = [
          { fullName: regexSearch },
          { 'contacts.email': regexSearch },
          { 'contacts.phone': regexSearch },
          { 'contacts.whatsapp': regexSearch },
          { 'contacts.messenger': regexSearch },
          { 'contacts.insta': regexSearch },
        ];
      }

      if (status !== 'any') {
        query = { ...query, status: status };
      }

      if (searchConditions.length > 0) {
        query = { ...query, $or: searchConditions };
      }

      archivedBookings = await ArchivedBooking.find(query).sort({ createdAt: -1 });

      results.resultCode = 0;
      results.totalCount = archivedBookings.length;
      results.bookings = archivedBookings.slice(startIndex, endIndex);
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      console.log(e);
      res.status(400).json({ results });
    }
  }

  async createBooking(req, res) {
    console.log(req.query.isAdmin + " isAdmin")
    if (!req.query.isAdmin && !req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};

    try {
      const newBooking = await BookingService.addBooking(req.body);
      await mailService.sendNewBookingConsultationMail('olenachristensen777@gmail.com', newBooking);
      results.resultCode = 0;
      results.booking = newBooking;
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      console.log(e);
      res.status(400).json(results);
    }
  }

  async reactivateBooking(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }
    const results = {};

    try {
      const newBooking = await BookingService.restoreBooking(res.booking);
      await mailService.sendNewBookingConsultationMail('olenachristensen777@gmail.com', newBooking);
      await res.booking.remove();
      results.resultCode = 0;
      results.booking = newBooking;
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async deleteBooking(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};
    try {
      await res.booking.remove();
      results.resultCode = 0;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(500).json(results);
    }
  }

  async changeBookingStatus(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};
    try {
      res.booking.status = !res.booking.status;
      await res.booking.save();
      results.status = res.booking.status;
      results.resultCode = 0;
      res.json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async bookingToClient(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }

    const results = {};
    try {
      const client = await BookingService.bookingToClient(res.booking);
      await client.save();
      await res.booking.remove();
      results.resultCode = 0;
      res.status(201).json(results);
    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }

  async archiveBooking(req, res) {
    if (!req.hasRole) {
      return res.status(403).json({ message: "You don't have permission" });
    }
    const results = {};

    try {
      const newArchivedBooking = await BookingService.archiveBooking(res.booking);
      await res.booking.remove();
      results.resultCode = 0;
      results.booking = await newArchivedBooking.save();
      res.status(201).json(results);

    } catch (e) {
      results.resultCode = 1;
      results.message = e.message;
      res.status(400).json(results);
    }
  }
}

module.exports = new bookingController();
