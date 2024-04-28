import * as React from "react";
import { Gallery } from "../../components/Portfolio/Gallery";
import { TattooStyles } from "../../components/Portfolio/TattooStyles";
import { TattooStyleType } from "../../types/Types";
import { ApiErrorMessage } from "../../components/common/ApiErrorMessage";
import {
  addTattooStyle,
  adminUpdateGallery,
  archiveGalleryItem,
  deleteGalleryItem,
  deleteTattooStyle,
  editTattooStyle,
  getGallery,
  getTattooStyles,
  resetActiveStyle,
  setActiveStyleAC,
  setApiErrorAC,
  setCurrentGalleryPageAC,
  setGalleryPageSizeAC,
  setSuccessModalAC,
  updateGalleryItem
} from "../../redux/Portfolio/portfolio-reducer";
import {SuccessPopUp} from "../../components/common/SuccessPopUp";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAuthSelector, getTokenSelector} from "../../redux/Auth/auth-selectors";
import {
  getActiveStyleSelector, getApiErrorSelector,
  getCurrentGalleryPage, getFakeApiSelector,
  getGalleryPageSize, getGallerySelector,
  getIsFetching, getIsGalleryItemDeletingInProcessSelector, getSuccessModalSelector, getTattooStylesSelector,
  getTotalGalleryItemsCount
} from "../../redux/Portfolio/portfolio-selectors";

export const Portfolio: React.FC = () => {
  const isAuth = useSelector(getAuthSelector);
  const isFetching = useSelector(getIsFetching);
  const totalCount = useSelector(getTotalGalleryItemsCount);
  const pageSize = useSelector(getGalleryPageSize);
  let currentPage = useSelector(getCurrentGalleryPage);
  const isDeletingInProcess = useSelector(getIsGalleryItemDeletingInProcessSelector);
  const tattooStyles = useSelector(getTattooStylesSelector);
  let activeStyle = useSelector(getActiveStyleSelector);
  const gallery = useSelector(getGallerySelector);
  const successModal = useSelector(getSuccessModalSelector);
  const apiError = useSelector(getApiErrorSelector);
  const fakeApi = useSelector(getFakeApiSelector);
  const token = useSelector(getTokenSelector);

  const dispatch = useDispatch();

  useEffect( () => {

    dispatch(getTattooStyles(token)).then(r => {
      if (!activeStyle?._id) {
        activeStyle = tattooStyles[0];
        dispatch(setActiveStyleAC(tattooStyles[0]));
      }
      dispatch(getGallery(activeStyle?._id, currentPage, pageSize));
    });

  }, [activeStyle, currentPage, pageSize]);

  useEffect(() => {
    if (successModal.isSuccess) {
      setTimeout( () => {
        setSuccessModalCallBack();
      }, 3000);
    }
  }, [successModal]);

  const setCurrentPageCallBack = (page: number) => {
    dispatch(setCurrentGalleryPageAC(page));
  }

  const setGalleryPageSizeCallBack = (pageSize: number) => {
    dispatch(setGalleryPageSizeAC(pageSize));
  }

  const adminUpdateGalleryCallBack = (values: FormData) => {
    dispatch(adminUpdateGallery(activeStyle._id, values));
  }

  const deleteGalleryItemCallBack = (itemId: string) => {
    dispatch(deleteGalleryItem(itemId, gallery, currentPage, totalCount, pageSize, activeStyle));
  }

  const resetActiveStyleCallBack = (style: TattooStyleType) => {
    dispatch(resetActiveStyle(style));
  }

  const addTattooStyleCallBack = (values: FormData) => {
    dispatch(addTattooStyle(values));
  }

  const editTattooStyleCallBack = (id: string, values: FormData) => {
    dispatch(editTattooStyle(id, values));
  }

  const deleteTattooStyleCallBack = (id: string) => {
    dispatch(deleteTattooStyle(id));
  }

  const archiveGalleryItemCallBack = (itemId: string) => {
    dispatch(archiveGalleryItem(itemId, gallery, currentPage, totalCount, pageSize, activeStyle));
  }

  const setSuccessModalCallBack = () => {
    dispatch(setSuccessModalAC(false, ''));
  }

  const setApiErrorCallBack = () => {
    dispatch(setApiErrorAC(''));
  }

  const updateGalleryItemCallBack = (id: string, values: object) => {
    dispatch(updateGalleryItem(id, values));
  }

  return (
    <div>
      <TattooStyles
        isAuth={isAuth}
        tattooStyles={tattooStyles}
        activeStyle={activeStyle}
        resetActiveStyle={resetActiveStyleCallBack}
        addTattooStyle={addTattooStyleCallBack}
        editTattooStyle={editTattooStyleCallBack}
        deleteTattooStyle={deleteTattooStyleCallBack}
      />

      <Gallery
        fakeApi={fakeApi}
        isAuth={isAuth}
        isFetching={isFetching}
        activeStyle={activeStyle}
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
        gallery={gallery}
        tattooStyles={tattooStyles}
        isDeletingInProcess={isDeletingInProcess}
        setCurrentPage={setCurrentPageCallBack}
        setPageSize={setGalleryPageSizeCallBack}
        updateGallery={adminUpdateGalleryCallBack}
        deleteGalleryItem={deleteGalleryItemCallBack}
        archiveGalleryItem={archiveGalleryItemCallBack}
        updateGalleryItem={updateGalleryItemCallBack}
      />
      <SuccessPopUp
          isOpen={successModal.isSuccess}
          closeModal={setSuccessModalCallBack}
          content={successModal.successText}
      />
      <ApiErrorMessage
          isOpen={!!apiError}
          error={apiError}
          closeModal={setApiErrorCallBack}
      />
    </div>
  );
}
