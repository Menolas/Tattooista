import * as React from "react";
import {SuccessPopUp} from "../../components/PopUps/SuccessPopUp";
import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    getApiErrorSelector,
    getSuccessModalSelector,
} from "../../redux/General/general-selectors";
import {setApiErrorAC, setSuccessModalAC} from "../../redux/General/general-reducer";
import {deleteStyle, getStyles, setActiveStyle, setActiveStyleAC} from "../../redux/Styles/styles-reducer";
import {useNavigate, useParams} from "react-router-dom";
import {
    getActiveStyleSelector,
    getIsStyleDeletingInProcess,
    getStylesSelector
} from "../../redux/Styles/styles-selectors";
import {ADMIN, SUPER_ADMIN, USER,} from "../../utils/constants";
import {Gallery} from "../../components/Portfolio/gallery/Gallery";
import {GalleryInfiniteScroll} from "../../components/Portfolio/gallery/GalleryInfiniteScroll";
import {ApiErrorMessageModal} from "../../components/common/ApiErrorMessageModal";
import {getIsAuthSelector, getTokenSelector} from "../../redux/Auth/auth-selectors";
import {
    getCurrentPageSelector, getGalleryApiErrorSelector,
    getIsGalleryItemDeletingInProcessSelector,
    getIsFetchingSelector, getPageSizeSelector,
    getTotalCountSelector
} from "../../redux/Gallery/gallery-selectors";
import {
    setCurrentGalleryPageAC,
    setGalleryApiErrorAC,
    setGalleryPageSizeAC
} from "../../redux/Gallery/gallery-reducer";
import {Styles} from "../../components/Portfolio/styles/Styles";
import {StyleType} from "../../types/Types";
import {AppDispatch} from "../../redux/redux-store";

export const PortfolioContainer: React.FC = () => {
    const isAuth = useSelector(getIsAuthSelector);
    const token = useSelector(getTokenSelector);
    const isFetching = useSelector(getIsFetchingSelector);

    let { activeStyleParam } = useParams<{ activeStyleParam?: string }>();

    const styles = useSelector(getStylesSelector);
    const activeStyle = useSelector(getActiveStyleSelector);
    const isStyleDeletingInProcess = useSelector(getIsStyleDeletingInProcess);

    const isGalleryItemDeletingInProcess = useSelector(getIsGalleryItemDeletingInProcessSelector);
    const totalCount = useSelector(getTotalCountSelector);
    const pageSize = useSelector(getPageSizeSelector);
    const currentPage = useSelector(getCurrentPageSelector);
    const apiError = useSelector(getApiErrorSelector);
    const galleryApiError = useSelector(getGalleryApiErrorSelector);

    const successModal = useSelector(getSuccessModalSelector);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const resetActiveStyleCallBack = (style: StyleType) => {
        dispatch(setActiveStyle(style));
    };

    const removeStyleCallBack = (id: string) => {
        dispatch(deleteStyle(token, id));
    };

    const setPageCallBack = (page: number) => {
        dispatch(setCurrentGalleryPageAC(page));
    };

    const setGalleryPageSizeCallBack = (pageSize: number) => {
        dispatch(setGalleryPageSizeAC(pageSize));
    };

    const setApiErrorCallBack = () => {
        dispatch(setApiErrorAC(null));
    };

    const setGalleryApiErrorCallBack = () => {
        dispatch(setGalleryApiErrorAC(null));
    };

    const setSuccessModalCallBack = useCallback(() => {
        dispatch(setSuccessModalAC(false, ''));
    }, [dispatch]);

    const [hasFetchedStyles, setHasFetchedStyles] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!hasFetchedStyles) {
            dispatch(getStyles(token, false)).then(() => {
                setHasFetchedStyles(true);
            });
        }
    }, [dispatch, token, hasFetchedStyles]);

    useEffect(() => {
        if (hasFetchedStyles) {
            if (activeStyleParam) {
                const style = styles.find(style => style._id === activeStyleParam);
                if (style) {
                    dispatch(setActiveStyleAC(style));
                } else if (styles.length > 0) {
                    navigate(`/portfolio/${styles[0]._id}`);
                }
            } else if (styles.length > 0) {
                navigate(`/portfolio/${styles[0]._id}`);
            }
        }
    }, [activeStyleParam, hasFetchedStyles, dispatch, navigate]);

    useEffect(() => {
        if (activeStyle && activeStyle._id !== activeStyleParam) {
            navigate(`/portfolio/${activeStyle._id}`);
        }
    }, [activeStyle, activeStyleParam, navigate]);

    useEffect(() => {
        if (successModal.isSuccess) {
            setTimeout( () => {
                setSuccessModalCallBack();
            }, 3000);
        }
    }, [successModal, setSuccessModalCallBack]);

    return (
        <>
            <Styles
                apiError={apiError}
                isAuth={isAuth}
                isFetching={isFetching}
                styles={styles}
                activeStyle={activeStyle}
                isDeletingInProcess={isStyleDeletingInProcess}
                resetActiveStyle={resetActiveStyleCallBack}
                remove={removeStyleCallBack}
                setApiError={setApiErrorCallBack}
            />
            { (isAuth === ADMIN || isAuth === SUPER_ADMIN) && activeStyle &&
                <Gallery
                    isFetching={isFetching}
                    activeStyle={activeStyle}
                    totalCount={totalCount}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    styles={styles}
                    isDeletingInProcess={isGalleryItemDeletingInProcess}
                    apiError={apiError}
                    setPage={setPageCallBack}
                    setPageSize={setGalleryPageSizeCallBack}
                    setApiError={setApiErrorCallBack}
                />
            }
            { (!isAuth || isAuth === USER) && activeStyle &&
                <GalleryInfiniteScroll
                    activeStyle={activeStyle}
                    pageSize={pageSize}
                    apiError={apiError}
                />
            }
            { galleryApiError &&
                <ApiErrorMessageModal
                    isOpen={!!galleryApiError}
                    error={galleryApiError}
                    closeModal={setGalleryApiErrorCallBack}
                />
            }
            <SuccessPopUp
                isOpen={successModal.isSuccess}
                closeModal={setSuccessModalCallBack}
                content={successModal.successText}
            />
        </>
    );
};
