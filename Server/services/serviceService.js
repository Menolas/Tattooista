const Service = require("../models/Service");
const ApiError = require("../exeptions/apiErrors");

const getConditions = (reqBody) => {
    const conditions = [];
    if (reqBody.condition_0 !== "undefined") conditions.push(reqBody.condition_0.trim());
    if (reqBody.condition_1 !== "undefined") conditions.push(reqBody.condition_1.trim());
    if (reqBody.condition_2 !== "undefined") conditions.push(reqBody.condition_2.trim());
    if (reqBody.condition_3 !== "undefined") conditions.push(reqBody.condition_3.trim());
    if (reqBody.condition_4 !== "undefined") conditions.push(reqBody.condition_4.trim());
    if (reqBody.condition_5 !== "undefined") conditions.push(reqBody.condition_5.trim());

    return conditions;
}

class ServiceService {
    async addService(data) {
        console.log(JSON.stringify(data) + "controller service from serervice")
        if (data.title) {
            const titleCandidate = await  Service.findOne({
                'title': data.title
            });
            if (titleCandidate) {
                throw ApiError.BadRequest(`The service "${data.title}" already exist`);
            }
        }

        const conditions = getConditions(data);

        return await Service.create({
            title: data.title.trim(),
            conditions: [...conditions]
        });
    }

    async editService(service, newData) {
        if (newData.title) {
            const titleCandidate = await  Service.findOne({
                'title': newData.title,
                _id: {$ne: service._id}
            });
            if (titleCandidate) {
                throw ApiError.BadRequest(`The service "${newData.title}" already exist`);
            }
        }

        const conditions = getConditions(newData);
        service.title = newData.title.trim();
        service.conditions = [...conditions];

        return service;
    }
}

module.exports = new ServiceService();
