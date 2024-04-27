import * as React from "react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { TattooStyleType } from "../../types/Types";
import {
  getIsFetching,
  getTattooStylesSelector,
  getGallerySelector,
  getTotalGalleryItemsCount,
  getGalleryPageSize,
  getCurrentGalleryPage,
  getIsGalleryItemDeletingInProcessSelector,
  getActiveStyleSelector,
  getApiErrorSelector,
  getFakeApiSelector,
  getSuccessModalSelector, getNoStyleLengthSelector
} from "../../redux/Portfolio/portfolio-selectors";
import {
  getGallery,
  adminUpdateGallery,
  deleteGalleryItem,
  setGalleryPageSizeAC,
  setCurrentGalleryPageAC,
  resetActiveStyle,
  addTattooStyle,
  editTattooStyle,
  deleteTattooStyle,
  archiveGalleryItem,
  getTattooStyles,
  setApiErrorAC,
  updateGalleryItem,
  setActiveStyleAC, setSuccessModalAC
} from "../../redux/Portfolio/portfolio-reducer";
import { Portfolio } from "./Portfolio";
import {getAuthSelector, getTokenSelector} from "../../redux/Auth/auth-selectors";

export const PortfolioContainer: React.FC = () =>  {
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
  const noStyleLength = useSelector(getNoStyleLengthSelector);
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
    <Portfolio
      fakeApi={fakeApi}
      isAuth={isAuth}
      isFetching={isFetching}
      totalCount={totalCount}
      pageSize={pageSize}
      currentPage={currentPage}
      isDeletingInProcess={isDeletingInProcess}
      tattooStyles={tattooStyles}
      activeStyle={activeStyle}
      gallery={gallery}
      successModal={successModal}
      apiError={apiError}
      noStyleLength={noStyleLength}
      setPageSize={setGalleryPageSizeCallBack}
      updateGallery={adminUpdateGalleryCallBack}
      deleteGalleryItem={deleteGalleryItemCallBack}
      setCurrentPage={setCurrentPageCallBack}
      resetActiveStyle={resetActiveStyleCallBack}
      addTattooStyle={addTattooStyleCallBack}
      editTattooStyle={editTattooStyleCallBack}
      deleteTattooStyle={deleteTattooStyleCallBack}
      archiveGalleryItem={archiveGalleryItemCallBack}
      setSuccessModal={setSuccessModalCallBack}
      setApiError={setApiErrorCallBack}
      updateGalleryItem={updateGalleryItemCallBack}
    />
  )
}
