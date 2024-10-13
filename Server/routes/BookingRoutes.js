const Router = require('express');
const router = new Router();
const Booking = require('../models/Booking');
const ArchivedBooking = require('../models/ArchivedBooking');
const controller = require('../controllers/bookingController');
const authRoleMiddleware = require('../middlewares/authRoleMiddleware');

// Getting bookings
router.get('/', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.getBookings );

// getting archived bookings

router.get('/archive', authRoleMiddleware(["ADMIN", "SUPERADMIN"]), controller.getArchivedBookings);

//getting one booking

router.get('/:id', getBooking, controller.getBooking);

// Creating one
router.post('/', controller.createBooking);

// Change booking status
router.patch('/status/:id', getBooking, controller.changeBookingStatus);

// turn booking to client

router.get('/bookingToClient/:id', getBooking, controller.bookingToClient);

// Delete bookings
router.delete('/:id', getBooking, controller.deleteBooking);

// delete Archived booking

router.delete('/archive/:id', getArchivedBooking, controller.deleteBooking);

// archive booking

router.get('/archive/:id', getBooking, controller.archiveBooking);

// reactivate booking

router.get('/reactivate/:id', getArchivedBooking, controller.reactivateBooking);

async function getBooking(req, res, next) {
  let booking;
  try {
    booking = await Booking.findById(req.params.id);
    if (booking == null) {
      return res.status(404).json({ message: 'Cannot find booking' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.booking = booking;
  next();
}

async function getArchivedBooking(req, res, next) {
  let booking;
  try {
    booking = await ArchivedBooking.findById(req.params.id);
    if (booking == null) {
      return res.status(404).json({ message: 'Cannot find archived booking' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.booking = booking;
  next();
}

module.exports = router;
