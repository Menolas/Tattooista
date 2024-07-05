const Client = require("../models/Client");
const ApiError = require("../exeptions/apiErrors");
class ClientService {
    async addClient(client) {
        if (client.email) {
            const emailCandidate = await  Client.findOne({'contacts.email': client.email})
            if (emailCandidate) {
                throw ApiError.BadRequest(`Client with email ${client.email} already exist`);
            }
        }

        if (client.phone) {
            const phoneCandidate = await  Client.findOne({'contacts.phone': client.phone})
            if (phoneCandidate) {
                throw ApiError.BadRequest(`Client with phone ${client.phone} already exist`);
            }
        }

        if (client.whatsapp) {
            const whatsappCandidate = await  Client.findOne({'contacts.whatsapp': client.whatsapp})
            if (whatsappCandidate) {
                throw ApiError.BadRequest(`Client with whatsapp ${client.whatsapp} already exist`);
            }
        }

        return await Client.create({
            fullName: client.clientName.trim(),
            contacts: {
                email: client.email,
                insta: client.insta.trim(),
                phone: client.phone,
                whatsapp: client.whatsapp,
                messenger: client.messenger.trim()
            }
        });
    }

    async editClient(clientId, newData) {
        if (newData.email) {
            const emailCandidate = await  Client.findOne({
                'contacts.email': newData.email,
                _id: {$ne: clientId}
            });
            if (emailCandidate) {
                throw ApiError.BadRequest(`Client with email ${newData.email} already exist`);
            }
        }

        if (newData.phone) {
            const phoneCandidate = await  Client.findOne({
                'contacts.phone': newData.phone,
                _id: {$ne: clientId}
            });
            if (phoneCandidate) {
                throw ApiError.BadRequest(`Client with phone ${newData.phone} already exist`);
            }
        }

        if (newData.whatsapp) {
            const whatsappCandidate = await  Client.findOne({
                'contacts.whatsapp': newData.whatsapp,
                _id: {$ne: clientId}
            });
            if (whatsappCandidate) {
                throw ApiError.BadRequest(`Client with whatsapp ${newData.whatsapp} already exist`);
            }
        }

        return true;

    }
}

module.exports = new ClientService();
