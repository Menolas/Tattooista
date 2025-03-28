const Review = require("../models/Review");
const ApiError = require("../exeptions/apiErrors");

class ReviewService {
    async addReview(data, userId) {
        console.log(JSON.stringify(data) + "review from service")
        if (userId) {
            const reviewCandidate = await  Review.findOne({
                'userId': userId
            });
            if (reviewCandidate) {
                throw ApiError.BadRequest(`You already added a review`);
            }
        }

        return await Review.create({
            rate: data.rate,
            content: data.content.trim(),
            user: userId
        });
    }

    async editReview(review, newData) {

        review.rate = newData.rate;
        review.content = newData.content.trim();

        return review;
    }
}

module.exports = new ReviewService();
