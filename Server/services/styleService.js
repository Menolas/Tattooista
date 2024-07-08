const Style = require("../models/TattooStyle");
const ApiError = require("../exeptions/apiErrors");

class StyleService {
    async addStyle(data) {
        console.log(JSON.stringify(data) + "controller service from serervice")
        if (data.value) {
            const valueCandidate = await  Style.findOne({
                'value': data.value
            });
            if (valueCandidate) {
                throw ApiError.BadRequest(`The tattoo style with name "${data.value}" already exist`);
            }
        }

        return await Style.create({
            value: data.value.trim(),
            description: data.description.trim()
        });
    }

    async editStyle(style, newData) {
        if (newData.value) {
            const valueCandidate = await  Style.findOne({
                'title': newData.title,
                _id: {$ne: style._id}
            });
            if (valueCandidate) {
                throw ApiError.BadRequest(`The tattoo style with name "${newData.value}" already exist`);
            }
        }

        style.value = newData.value.trim();
        style.description = newData.description.trim();

        return style;
    }
}

module.exports = new StyleService();
