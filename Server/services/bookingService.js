const Booking = require("../models/Booking");
const ApiError = require("../exeptions/apiErrors");
const mailService = require("./mailService");

class BookingService {
    async addBooking(booking) {

        const emailCandidate = await  Booking.findOne({'contacts.email': booking.contacts.email})
        if (emailCandidate) {
            throw ApiError.BadRequest(`The request for consultation for email ${booking.contacts.email} already exist`);
        }
        const phoneCandidate = await  Booking.findOne({'contacts.phone': booking.contacts.phone})
        if (phoneCandidate) {
            throw ApiError.BadRequest(`The request for consultation for phone ${booking.contacts.phone} already exist`);
        }

        const whatsappCandidate = await  Booking.findOne({'contacts.whatsapp': booking.contacts.whatsapp})
        if (whatsappCandidate) {
            throw ApiError.BadRequest(`The request for consultation for whatsapp ${booking.contacts.whatsapp} already exist`);
        }

        let newBooking = await Booking.create({
            fullName: booking.fullName.trim(),
            contacts: {
                email: booking.contacts.email,
                phone: booking.contacts.phone,
                whatsapp: booking.contacts.whatsapp,
                messenger: booking.contacts.messenger.trim(),
                insta: booking.contacts.insta.trim()
            },
            message: booking.message
        });

        await mailService.sendNewBookingConsultationMail('olenachristensen777@gmail.com', newBooking);

        return newBooking;
    }
}

module.exports = new BookingService();
