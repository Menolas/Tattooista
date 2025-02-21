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
    reviews: Array<ReviewType>;
    totalCount: number;
    currentPage: number;
    pageLimit: number;
    isFetching: boolean;
    isDeletingInProcess: Array<string>;
    setPageLimit: (limit:number) => void;
    setCurrentPage: (page: number) => void;
}

export const Reviews: React.FC<PropsType> = ({
  reviews,
  totalCount,
  currentPage,
  pageLimit,
  isFetching,
  isDeletingInProcess,
  setPageLimit,
  setCurrentPage,
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
                <button
                    className="btn btn--bg btn--light-bg add-btn"
                    onClick={() => {
                        setAddReviewMode(true)
                    }}
                >
                    Add a Review
                </button>
                <Paginator
                    totalCount={totalCount}
                    pageSize={pageLimit}
                    currentPage={currentPage}
                    onPageChanged={setCurrentPage}
                    setPageLimit={setPageLimit}
                />
            </div>
            <ul className="reviews__list">
                { reviews.length
                    ? reviews.map((data, index) => {
                        return <ReviewItem key={index} data={data}/>
                    })
                    : null
                }
                <li className="reviews__item">
                    <div className="reviews__item-header">
                        <div className="reviews__item-user">
                            <DefaultAvatar/>
                            {/*<img src="" alt=""/>*/}
                            <span className="reviews__item-user-name">Vasya Pupkin</span>
                            <span className="reviews__item-user-date">56 June 3456</span>
                        </div>
                        <div className="reviews__rate">
                            <StarFilled/>
                            <StarFilled/>
                            <StarFilled/>
                            <StarFilled/>
                            <StarFilled/>
                        </div>
                    </div>

                    <div className="reviews__content">
                        Absolutely love my new ink! The lines are crisp, the shading is flawless, and the detail is
                        insane.
                        The artist truly brought my vision to life. Couldn’t be happier!
                    </div>
                </li>
                <li className="reviews__item">
                    <div className="reviews__item-header">
                        <div className="reviews__item-user">
                            <DefaultAvatar/>
                            {/*<img src="" alt=""/>*/}
                            <span className="reviews__item-user-name">Vasya Pupkin</span>
                            <span className="reviews__item-user-date">56 June 3456</span>
                        </div>
                        <div className="reviews__rate">
                            <StarFilled/>
                            <StarFilled/>
                            <StarFilled/>
                            <StarFilled/>
                            <StarFilled/>
                        </div>
                    </div>

                    <div className="reviews__content">
                        Absolutely love my new ink! The lines are crisp, the shading is flawless, and the detail is
                        insane.
                        The artist truly brought my vision to life. Couldn’t be happier!
                    </div>
                </li>
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
}
