import {CommonResponseFields, ReviewType, SearchFilterType, UpdateReviewFormValues} from "../../types/Types";
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

    async getReviews(
        currentPage = 1,
        pageLimit = 5,
        filter: SearchFilterType,
    ) {
        return await $api.get<GetReviewsResponseType>(
            `reviews?&page=${currentPage}&limit=${pageLimit}&term=${filter.term}&gallery=${filter.condition}&rate=${filter.rate}`)
            .then(response => response.data);
    },

    async getUserReviews(id: string) {
        return await $api.get<GetReviewsResponseType>(
            `reviews/${id}`)
            .then(response => response.data);
    },

    async addReview(
        userId: string | undefined,
        token: string | null,
        values: FormData,
    ) {
        return await $api.post<AddReviewResponseType>(
            `reviews/${userId}`,
            values,
            {headers: {Authorization: `Bearer ${token}`}}
        ).then(response => response.data);
    },

    async updateReview(
        userId: string | undefined,
        token: string | null,
        values: FormData,
    ) {
        return await $api.post<AddReviewResponseType>(
            `reviews/reviewUpdate/${userId}`,
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

    async deleteReviewGalleryPicture(
        token: string | null,
        reviewId: string,
        picture: string
    ) {
        return await $api.delete<AddReviewResponseType>(
            `reviews/updateGallery/${reviewId}?&picture=${picture}`,
            { headers: { Authorization: `Bearer ${token}` } }
        ).then(response => response.data);
    },
};
