import * as React from "react";
import {ReactComponent as Star} from "../../../assets/svg/star.svg";
import {ReactComponent as StarFilled} from "../../assets/svg/star-filled.svg";
import {DefaultAvatar} from "../../components/common/DefaultAvatar";
import {Paginator} from "../../components/common/Paginator";
import {useDispatch, useSelector} from "react-redux";
import {
    getCurrentPageSelector,
    getPageLimitSelector,
    getTotalCountSelector
} from "../../redux/Reviews/reviews-selectors";
import {
    setCurrentPageAC,
    setPageLimitAC
} from "../../redux/Reviews/reviews-reducer";
import {AppDispatch} from "../../redux/redux-store";

export const Reviews = () => {

    const totalCount = useSelector(getTotalCountSelector);
    const pageSize = useSelector(getPageLimitSelector);
    const currentPage = useSelector(getCurrentPageSelector);

    const dispatch = useDispatch<AppDispatch>();

    const setCurrentPageCallBack = (page: number) => {
        dispatch(setCurrentPageAC(page));
    }

    const setPageLimitCallBack = (pageLimit: number) => {
        dispatch(setPageLimitAC(pageLimit));
    }

    return (
        <div className="reviews container">
            <div className="admin__cards-header">
                <button
                    className="btn btn--bg btn--light-bg add-btn"
                    onClick={() => {
                        //setAddConsultationMode(true)
                    }}
                >
                    Add a Review
                </button>
                <Paginator
                    totalCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChanged={setCurrentPageCallBack}
                    setPageLimit={setPageLimitCallBack}
                />
            </div>
            <ul className="reviews__list">
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
        </div>
    );
}
