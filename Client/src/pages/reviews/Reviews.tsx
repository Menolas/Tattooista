import * as React from "react";
import {ReactComponent as Star} from "../../../assets/svg/star.svg";
import {ReactComponent as StarFilled} from "../../assets/svg/star-filled.svg";
import {DefaultAvatar} from "../../components/common/DefaultAvatar";
import {Paginator} from "../../components/common/Paginator";
import {useSelector} from "react-redux";
import {getReviewUpdateErrorSelector,
} from "../../redux/Reviews/reviews-selectors";
import {useState} from "react";
import {ModalPopUp} from "../../components/PopUps/ModalPopUp";
import {UpdateReviewForm} from "../../components/Forms/UpdateReviewForm";
import {ReviewType} from "../../types/Types";
import {ReviewItem} from "./ReviewItem";

type PropsType = {
    isAuth: null | string;
    reviews: Array<ReviewType>;
    totalCount: number;
    currentPage: number;
    pageLimit: number;
    isFetching: boolean;
    isReviewSubmitted: boolean;
    isDeletingInProcess: Array<string>;
    setPageLimit: (limit:number) => void;
    setCurrentPage: (page: number) => void;
    remove: (id: string) => void;
}

export const Reviews: React.FC<PropsType> = ({
  isAuth,
  reviews,
  totalCount,
  currentPage,
  pageLimit,
  isFetching,
  isDeletingInProcess,
  isReviewSubmitted,
  setPageLimit,
  setCurrentPage,
                                                 remove,
}) => {
    const apiError = useSelector(getReviewUpdateErrorSelector);
    const modalTitle = "Update your review here";

    const [addReviewMode, setAddReviewMode] = useState<boolean>(false);

    const closeModal = () => {
        setAddReviewMode(false);
    };

    return (
        <section className="reviews container">
            <div className="admin__cards-header">
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
                                    isAuth={isAuth}
                                    isDeletingInProcess={isDeletingInProcess}
                                    data={data}
                                    remove={remove}
                                />
                    })
                    : null
                }
            </ul>
            <ModalPopUp
                isOpen={addReviewMode}
                modalTitle={modalTitle}
                closeModal={closeModal}
            >
                <UpdateReviewForm apiError={apiError} closeModal={closeModal} />
            </ModalPopUp>
        </section>
    );
};
