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
            rate: data.starsNumber,
            content: data.content.trim(),
            userId: userId
        });
    }

    async editReview(review, newData, userId) {

        review.starsNumber = newData.starsNumber;
        review.content = newData.content.trim();
        review.userId = userId;

        return review;
    }
}

module.exports = new ReviewService();
