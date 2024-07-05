const Booking = require("../models/Booking");
const ApiError = require("../exeptions/apiErrors");
const mailService = require("./mailService");

class BookingService {
    async addBooking(booking) {
        if (booking.email) {
            const emailCandidate = await  Booking.findOne({'contacts.email': booking.email})
            if (emailCandidate) {
                throw ApiError.BadRequest(`The request for consultation for email ${booking.email} already exist`);
            }
        }

        if (booking.phone) {
            const phoneCandidate = await  Booking.findOne({'contacts.phone': booking.phone})
            if (phoneCandidate) {
                throw ApiError.BadRequest(`The request for consultation for phone ${booking.phone} already exist`);
            }
        }

        if (booking.whatsapp) {
            const whatsappCandidate = await  Booking.findOne({'contacts.whatsapp': booking.whatsapp})
            if (whatsappCandidate) {
                throw ApiError.BadRequest(`The request for consultation for whatsapp ${booking.whatsapp} already exist`);
            }
        }


        return await Booking.create({
            fullName: booking.fullName.trim(),
            contacts: {
                email: booking.email,
                phone: booking.phone,
                whatsapp: booking.whatsapp,
                messenger: booking.messenger?.trim(),
                insta: booking.insta?.trim(),
            },
            message: booking.message
        });
    }
}

module.exports = new BookingService();
