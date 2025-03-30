const Review = require("../models/Review");
const ApiError = require("../exeptions/apiErrors");

class ReviewService {
    async addReview(data, userId) {
        if (userId) {
            const userReviewsCount = await Review.countDocuments({ user: userId });

            if (userReviewsCount >= 3) {
                throw ApiError.BadRequest(`You already submitted the maximum of 3 reviews.`);
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
