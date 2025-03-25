import {CommonResponseFields, ReviewType, UpdateReviewFormValues} from "../../types/Types";
import $api from "../../http";

type GetReviewsResponseType = CommonResponseFields & {
    reviews: Array<ReviewType>;
    totalCount: number;
};

type AddReviewResponseType = CommonResponseFields & {
    review: ReviewType
};

type DeleteReviewResponseType = AddReviewResponseType;

export const reviewsAPI = {

    async getReviews() {
        return await $api.get<GetReviewsResponseType>('reviews')
            .then(response => response.data);
    },

    async addReview(
        userId: string | undefined,
        token: string | null,
        values: UpdateReviewFormValues,
    ) {
        return await $api.post<AddReviewResponseType>(
            `reviews/${userId}`,
            values,
            {headers: {Authorization: `Bearer ${token}`}}
        ).then(response => response.data);
    },

    async deleteReview(
        token: string | null,
        userId: string
    ) {
        return await $api.delete<DeleteReviewResponseType>(
            `reviews/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(response => response.data);
    },
};
