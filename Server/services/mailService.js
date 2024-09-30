const nodemailer = require('nodemailer');
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
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Account activation on ' + process.env.CLIENT_URL,
            text: '',
            html:
                `
                     <div>
                         <h1>Activate you account with one click</h1>
                         <a href=${link}>${link}</a>
                     </div>
                 `
        });
    }

    async sendNewBookingConsultationMail(to, booking) {
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
                 <div style="background-color: #080808; color: #afafaf; padding: 2rem;">
                     <div style="text-align: center;">
                         <img src="${process.env.SERVER_URL}/logo.png" alt="" width="100" height="100" style="object-fit: contain;"/>
                     </div>
                     <h1 style="text-align: center;">You have a new request for consultation</h1>
                     <div>
                         ${bookingInfo()}
                     </div>
                 </div>
                `
        });
    }
}

module.exports = new MailService();
