import {CommonResponseFields, ReviewType, UpdateReviewFormValues} from "../../types/Types";
import $api from "../../http";

type GetReviewsResponseType = CommonResponseFields & {
    reviews: Array<ReviewType>;
    totalCount: number;
}

type AddReviewResponseType = CommonResponseFields & {
    review: ReviewType
}

export const reviewsAPI = {

    async getReviews() {
        return await $api.get<GetReviewsResponseType>('reviews')
            .then(response => response.data);
    },

    async addReview(
        token: string | null,
        values: UpdateReviewFormValues,
    ) {
        return await $api.post<AddReviewResponseType>(
            'reviews',
            values,
            {headers: {Authorization: `Bearer ${token}`}}
        ).then(response => response.data);
    }
};
