const nodemailer = require('nodemailer');
const {sign} = require("jsonwebtoken");
class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }
    async sendActivationMail(to, name, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Account activation on Tattooista App',
            text: '',
            html:
                `
                 <div style="background-color: #080808; color: #fafafa; padding: 2rem;">
                     <div style="text-align: center;">
                         <img src="${process.env.SERVER_URL}/logo.png" alt="" width="100" height="100" style="object-fit: contain;"/>
                     </div>
                     <h1 style="text-align: center;">Congratulations, ${name}! Now you are belong to the circle of chosens.</h1>
                     <p style="text-align: center; color: #fafafa;">Activate your account with one click</p>
                     <a style="color: #fafafa;" href=${link}>${link}</a>
                 </div>
                 `
        });
    }

    async sendNewBookingConsultationMail(to, booking) {
        const tempToken = sign(
            { bookingId: booking._id },
            process.env.TEMP_TOKEN_SECRET,
            { expiresIn: '48h' }
        );

        const link = `${process.env.CLIENT_URL}/admin/bookingProfile?bookingId=${booking._id}&tempToken=${tempToken}`;
        const bookingInfo = () => {
            let contactsInfo = '';
            for (const contactType in booking.contacts) {
                if (booking.contacts[contactType] && typeof booking.contacts[contactType] === 'string') {
                    contactsInfo += `<p><b>${contactType}:</b> ${booking.contacts[contactType]}</p>`;
                }
            }
            return `
                <p><b>Name:</b> ${booking.fullName}</p>
                ${contactsInfo}
                <p><b>Message:</b> ${booking.message}</p>
            `
        };

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: `New consultation request on Tattooista`,
            text: '',
            html:
                `
                 <div style="background-color: #080808; color: #fafafa; padding: 2rem;">
                     <div style="text-align: center;">
                         <img src="${process.env.SERVER_URL}/logo.png" alt="" width="100" height="100" style="object-fit: contain;"/>
                     </div>
                     <h1 style="text-align: center;">You have a new request for consultation</h1>
                     <div>
                         ${bookingInfo()}
                     </div>
                     <div>
                         <span>Link to this consultation:</span>
                         <a style="color: #fafafa;" href=${link}>${link}</a>
                     </div>
                 </div>
                `
        });
    }
}

module.exports = new MailService();
