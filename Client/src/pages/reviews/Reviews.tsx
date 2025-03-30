import * as React from "react";
import {Paginator} from "../../components/common/Paginator";
import {useState} from "react";
import {ReviewType, SearchFilterType} from "../../types/Types";
import {ReviewItem} from "./ReviewItem";
import {clientFilterSelectOptions} from "../../utils/constants";
import {SearchFilterForm} from "../../components/Forms/SearchFilterForm";
import {ModalPopUp} from "../../components/PopUps/ModalPopUp";
import {UpdateReviewForm} from "../../components/Forms/UpdateReviewForm";
import {Preloader} from "../../components/common/Preloader";
import {NothingToShow} from "../../components/common/NothingToShow";

type PropsType = {
    isAuth: null | string;
    reviews: Array<ReviewType>;
    totalCount: number;
    currentPage: number;
    pageLimit: number;
    isFetching: boolean;
    filter: SearchFilterType;
    apiError: null | string;
    isSubmittedReviews: number;
    isDeletingInProcess: Array<string>;
    setPageLimit: (limit:number) => void;
    setCurrentPage: (page: number) => void;
    remove: (id: string) => void;
    onFilterChanged: (filter: SearchFilterType) => void;
    setReviewApiError: () => void;
}

export const Reviews: React.FC<PropsType> = ({
  isAuth,
  reviews,
  totalCount,
  currentPage,
  pageLimit,
  isFetching,
  filter,
  apiError,
  isDeletingInProcess,
  isSubmittedReviews,
  setPageLimit,
  setCurrentPage,
  onFilterChanged,
  remove,
  setReviewApiError,
}) => {

    const [addReviewMode, setAddReviewMode] = useState<boolean>(false);
    console.log(isSubmittedReviews + " isSubmittedReviews !!!!!!!!!!!!!!")

    const closeModal = () => {
        setAddReviewMode(false);
        setReviewApiError();
    };

    const reviewElements = reviews?.map((data, index) => {
        return <ReviewItem
                    key={index}
                    isAuth={isAuth}
                    isDeletingInProcess={isDeletingInProcess}
                    data={data}
                    apiError={apiError}
                    remove={remove}
                    setReviewApiError={setReviewApiError}
                />
    });

    return (
        <section className="reviews container">
            <div className="admin__cards-header">
                <SearchFilterForm
                    isRated={true}
                    options={clientFilterSelectOptions}
                    filter={filter}
                    onFilterChanged={onFilterChanged}
                />
                { (isAuth !== null && isSubmittedReviews < 3) &&
                    <button
                        className="btn btn--bg btn--light-bg add-btn"
                        onClick={() => {
                            setAddReviewMode(true)
                        }}
                    >
                        Add a Review
                    </button>
                }
                {
                    totalCount > pageLimit &&
                    <Paginator
                        totalCount={totalCount}
                        pageSize={pageLimit}
                        currentPage={currentPage}
                        onPageChanged={setCurrentPage}
                        setPageLimit={setPageLimit}
                    />
                }
            </div>
            {
                isFetching
                    ? <Preloader/>
                    : totalCount && totalCount > 0
                        ? (
                            <ul className="reviews__list">
                                { reviewElements }
                            </ul>
                        )
                        : <NothingToShow/>
            }
            {addReviewMode && (
                <ModalPopUp
                    isOpen={addReviewMode}
                    modalTitle={"Leave a review"}
                    closeModal={closeModal}
                >
                    <UpdateReviewForm
                        apiError={apiError}
                        isEditing={false}
                        closeModal={closeModal}
                    />
                </ModalPopUp>
            )}
        </section>
    );
};
