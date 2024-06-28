import * as React from "react";
import { Gallery } from "./Gallery";
import { GalleryInfiniteScroll } from "./GalleryInfiniteScroll";
import {
  archiveGalleryItem,
  deleteGalleryItem,
  getGallery,
  setCurrentGalleryPageAC,
  setGalleryPageSizeAC,
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
import {getApiErrorSelector} from "../../../redux/General/general-selectors";
import {ADMIN, SUPER_ADMIN, USER} from "../../../utils/constants";

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
  const apiError = useSelector(getApiErrorSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGallery(activeStyle?._id, currentPage, pageSize))
  }, [activeStyle, currentPage, pageSize]);

  const setPageCallBack = (page: number) => {
    dispatch(setCurrentGalleryPageAC(page));
  }

  const setGalleryPageSizeCallBack = (pageSize: number) => {
    dispatch(setGalleryPageSizeAC(pageSize));
  }

  const deleteGalleryItemCallBack = (itemId: string) => {
    dispatch(deleteGalleryItem(itemId, gallery, currentPage, pageSize, activeStyle));
  }

  const archiveGalleryItemCallBack = (itemId: string) => {
    dispatch(archiveGalleryItem(itemId, gallery, currentPage, pageSize, activeStyle));
  }

  return (
      <>
        { (isAuth === ADMIN || isAuth === SUPER_ADMIN) &&
          <Gallery
              isFetching={isFetching}
              activeStyle={activeStyle}
              totalCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              gallery={gallery}
              styles={styles}
              isDeletingInProcess={isDeletingInProcess}
              apiError={apiError}
              setPage={setPageCallBack}
              setPageSize={setGalleryPageSizeCallBack}
              remove={deleteGalleryItemCallBack}
              archive={archiveGalleryItemCallBack}
          />
        }
        { (!isAuth || isAuth === USER) &&
            <GalleryInfiniteScroll
                fakeApi={fakeApi}
                activeStyle={activeStyle}
                pageSize={pageSize}
            />
        }
      </>
  );
}
