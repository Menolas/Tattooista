const FaqItem = require("../models/FaqItem");
const ApiError = require("../exeptions/apiErrors");

class FaqService {
    async addFaqItem(data) {
        if (data.question) {
            const questionCandidate = await  FaqItem.findOne({
                'question': data.question
            });
            if (questionCandidate) {
                throw ApiError.BadRequest(`The FAQ with question "${data.question}" already exist`);
            }
        }

        return await FaqItem.create({
            question: data.question.trim(),
            answer: data.answer.trim()
        });
    }

    async editFaqItem(faqId, newData) {
        if (newData.question) {
            const questionCandidate = await  FaqItem.findOne({
                'question': newData.question,
                _id: {$ne: faqId}
            });
            if (questionCandidate) {
                throw ApiError.BadRequest(`The FAQ with question "${newData.question}" already exist`);
            }
        }

        return true;
    }
}

module.exports = new FaqService();
