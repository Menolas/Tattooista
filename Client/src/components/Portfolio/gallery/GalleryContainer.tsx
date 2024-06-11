import * as React from "react";
import { Gallery } from "./Gallery";
import {
  adminUpdateGallery,
  archiveGalleryItem,
  deleteGalleryItem,
  getGallery,
  setCurrentGalleryPageAC,
  setGalleryPageSizeAC,
  updateGalleryItem
} from "../../../redux/Gallery/gallery-reducer";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getAuthSelector} from "../../../redux/Auth/auth-selectors";
import {
  getCurrentPageSelector,
  getFakeApiSelector,
  getPageSizeSelector,
  getGallerySelector,
  getIsFetchingSelector,
  getIsDeletingInProcessSelector,
  getTotalCountSelector
} from "../../../redux/Gallery/gallery-selectors";

import {
  getActiveStyleSelector,
  getStylesSelector,
} from "../../../redux/Styles/styles-selectors";

export const GalleryContainer: React.FC = () => {

  const isAuth = useSelector(getAuthSelector);
  const isFetching = useSelector(getIsFetchingSelector);
  const isDeletingInProcess = useSelector(getIsDeletingInProcessSelector);
  const fakeApi = useSelector(getFakeApiSelector);
  const totalCount = useSelector(getTotalCountSelector);
  const pageSize = useSelector(getPageSizeSelector);
  const currentPage = useSelector(getCurrentPageSelector);
  const styles = useSelector(getStylesSelector);
  const activeStyle = useSelector(getActiveStyleSelector);
  const gallery = useSelector(getGallerySelector);

  const dispatch = useDispatch();

  useEffect( () => {
    dispatch(getGallery(activeStyle?._id, currentPage, pageSize));
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
    dispatch(deleteGalleryItem(itemId, gallery, currentPage, pageSize, activeStyle));
  }

  const archiveGalleryItemCallBack = (itemId: string) => {
    dispatch(archiveGalleryItem(itemId, gallery, currentPage, pageSize, activeStyle));
  }

  const updateGalleryItemCallBack = (id: string, values: object) => {
    dispatch(updateGalleryItem(id, values, activeStyle._id, currentPage, pageSize));
  }

  return (
    <div>
      <Gallery
        fakeApi={fakeApi}
        isAuth={isAuth}
        isFetching={isFetching}
        activeStyle={activeStyle}
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
        gallery={gallery}
        styles={styles}
        isDeletingInProcess={isDeletingInProcess}
        setCurrentPage={setCurrentPageCallBack}
        setPageSize={setGalleryPageSizeCallBack}
        updateGallery={adminUpdateGalleryCallBack}
        remove={deleteGalleryItemCallBack}
        archive={archiveGalleryItemCallBack}
        updateItem={updateGalleryItemCallBack}
      />
    </div>
  );
}
