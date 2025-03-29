import * as React from "react";
import {Paginator} from "../../components/common/Paginator";
import {useState} from "react";
import {ReviewType, SearchFilterType} from "../../types/Types";
import {ReviewItem} from "./ReviewItem";
import {clientFilterSelectOptions} from "../../utils/constants";
import {SearchFilterForm} from "../../components/Forms/SearchFilterForm";

type PropsType = {
    isAuth: null | string;
    reviews: Array<ReviewType>;
    totalCount: number;
    currentPage: number;
    pageLimit: number;
    isFetching: boolean;
    filter: SearchFilterType;
    isReviewSubmitted: boolean;
    isDeletingInProcess: Array<string>;
    setPageLimit: (limit:number) => void;
    setCurrentPage: (page: number) => void;
    remove: (id: string) => void;
    onFilterChanged: (filter: SearchFilterType) => void;
}

export const Reviews: React.FC<PropsType> = ({
  isAuth,
  reviews,
  totalCount,
  currentPage,
  pageLimit,
  isFetching,
  filter,
  isDeletingInProcess,
  isReviewSubmitted,
  setPageLimit,
  setCurrentPage,
  onFilterChanged,
  remove,
}) => {

    const [addReviewMode, setAddReviewMode] = useState<boolean>(false);

    const closeModal = () => {
        setAddReviewMode(false);
    };

    return (
        <section className="reviews container">
            <div className="admin__cards-header">
                <SearchFilterForm
                    isRated={true}
                    options={clientFilterSelectOptions}
                    filter={filter}
                    onFilterChanged={onFilterChanged}
                />
                { isAuth !== null && !isReviewSubmitted &&
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
            <ul className="reviews__list">
                { reviews.length
                    ? reviews.map((data, index) => {
                        return <ReviewItem
                                    key={index}
                                    addReviewMode={addReviewMode}
                                    isAuth={isAuth}
                                    isDeletingInProcess={isDeletingInProcess}
                                    data={data}
                                    closeUpdateReviewMode={closeModal}
                                    remove={remove}
                                />
                    })
                    : null
                }
            </ul>
        </section>
    );
};
