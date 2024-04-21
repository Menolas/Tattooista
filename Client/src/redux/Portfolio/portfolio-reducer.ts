import { portfolioApi } from "./PortfolioApi";
import { TattooStyleType, GalleryItemType } from "../../types/Types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "../redux-store";
import {ResultCodesEnum} from "../../utils/constants";
import {getNewPage} from "../../utils/functions";
import {tattooStyles} from "../../data/StylesData";
import { gallery } from "../../data/GalleryData";

const SET_GALLERY_PAGE_SIZE = 'SET_GALLERY_PAGE_SIZE';
const SET_ARCHIVED_GALLERY_PAGE_SIZE = 'SET_ARCHIVED_GALLERY_PAGE_SIZE';
const SET_CURRENT_GALLERY_PAGE = 'SET_CURRENT_GALLERY_PAGE';
const SET_CURRENT_ARCHIVED_GALLERY_PAGE = 'SET_CURRENT_ARCHIVED_GALLERY_PAGE';
const SET_GALLERY_TOTAL_COUNT = 'SET_GALLERY_TOTAL_COUNT';
const SET_ARCHIVED_GALLERY_TOTAL_COUNT = 'SET_ARCHIVED_GALLERY_TOTAL_COUNT';
const SET_STYLES = 'SET_STYLES';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS';
const SET_ACTIVE_STYLE = 'SET_ACTIVE_STYLE';
const SET_GALLERY = 'SET_GALLERY';
const UPDATE_GALLERY = 'UPDATE_GALLERY';
const UPDATE_GALLERY_ITEM = 'UPDATE_GALLERY_ITEM';
const UPDATE_ARCHIVED_GALLERY_ITEM = 'UPDATE_ARCHIVED_GALLERY_ITEM';
const SET_ARCHIVED_GALLERY = 'SET_ARCHIVED_GALLERY';
const DELETE_GALLERY_ITEM = 'DELETE_GALLERY_ITEM';
const DELETE_ARCHIVED_GALLERY_ITEM = 'DELETE_ARCHIVED_GALLERY_ITEM';
const SET_SUCCESS_MODAL = 'SET_SUCCESS_MODAL';
const SET_FAKE_API = 'SET_FAKE_API';
const ADD_TATTOO_STYLE_SUCCESS = 'You successfully added a new Tattoo style to your gallery.';
const UPDATE_TATTOO_STYLE_SUCCESS = 'You successfully updated Tattoo style in your gallery.';
const ADD_GALLERY_ITEMS_SUCCESS = 'You successfully added gallery images';
const EDIT_GALLERY_ITEM_SUCCESS = 'You successfully edited gallery image';
const SET_API_ERROR = 'SET_API_ERROR';

let initialState = {
  totalGalleryItemsCount: 0 as number,
  totalArchivedGalleryItemsCount: 0 as number | null,
  galleryPageSize: 16 as number | null,
  archivedGalleryPageSize: 16 as number,
  currentGalleryPage: 1 as number,
  currentArchivedGalleryPage: 1 as number,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  tattooStyles: [] as Array<TattooStyleType>,
  activeStyle: {} as TattooStyleType | null,
  gallery: [] as Array<GalleryItemType>,
  archivedGallery: [] as Array<GalleryItemType>,
  fakeApi: false as boolean,
  successModal: {
    isSuccess: false as boolean,
    successText: '' as string,
  },
  apiError: '' as string
}

export type SuccessModalType = typeof initialState.successModal;

export type InitialStateType = typeof initialState;

//Black@Gray Black-and-gray is sometimes referred to as "jailhouse" or "joint style" and is thought to have originated in prisons where inmates had limited access to different materials; they resorted to using guitar strings for needles and used cigarette ashes or pen ink to produce tattoos.
//FineLine Fine line tattooing consists of distinct straight or curved thin lines, without gradations in shade or color to represent 2D or 3D objects, emphasizing form and outline over color, shading, and texture. These tattoos can have incredible levels of detail built in, without being 'loud' about it
//BlackWork A blackwork tattoo is a bold work of body art rendered in solid planes of black ink. Usually, these tattoos are composed of abstract patterns and geometric shapes, though some feature figurative forms and recognizable scenes and subjects.
//NeoTraditional Neo-traditional tattoo designs feature bold, dark outlines and illustrative looks. There is a feeling of subtle dimension and the use of saturated colors. This dimension is not a 3D type of tattoo, yet they contain lines that vary in weight. This style of tattoo art consists of an illustrated look.
//Realistic Realism tattoos can depict anything, with the only requirement being that the tattoo looks as close to photorealistic as possible. Portraits of famous people, loved ones, nature, and meaningful objects are all common choices for realistic tattoos.
//Designs Here you can see some of my designs and drawings.
//OldSchool
//No style Here the images of tattoos which difficult to define which style it is actually

export const portfolioReducer = (
  state = initialState,
  action: ActionsTypes): InitialStateType => {

  switch (action.type) {
    case SET_GALLERY_PAGE_SIZE:
      return {
        ...state,
        galleryPageSize: action.pageSize,
        currentGalleryPage: 1

      }

    case SET_ARCHIVED_GALLERY_PAGE_SIZE:
      return {
        ...state,
        archivedGalleryPageSize: action.pageSize,
        currentArchivedGalleryPage: 1
      }

    case SET_CURRENT_GALLERY_PAGE:
      return {
        ...state,
        currentGalleryPage: action.page
      }

    case SET_CURRENT_ARCHIVED_GALLERY_PAGE:
      return {
        ...state,
        currentArchivedGalleryPage: action.page
      }

    case SET_GALLERY_TOTAL_COUNT:
      return {
        ...state,
        totalGalleryItemsCount: action.total
      }

    case SET_ARCHIVED_GALLERY_TOTAL_COUNT:
      return {
        ...state,
        totalArchivedGalleryItemsCount: action.totalCount
      }
    case TOGGLE_IS_FETCHING:
      return {
        ...state,
        isFetching: action.isFetching,
      }

    case TOGGLE_IS_DELETING_IN_PROCESS:
      return {
        ...state,
        isDeletingInProcess: action.isFetching
            ? [...state.isDeletingInProcess, action.id]
            : state.isDeletingInProcess.filter(id => id !== action.id)
      }

    case SET_STYLES:
      return {
        ...state,
        tattooStyles: action.tattooStyles
      }

    case SET_ACTIVE_STYLE:

      return {
        ...state,
        activeStyle: action.style,
        //activeStyleValue: action.style.value,
        currentGalleryPage: 1
      }

    case SET_GALLERY:
      return {
        ...state,
        gallery: action.gallery
      }

    case SET_ARCHIVED_GALLERY:
      return {
        ...state,
        archivedGallery: [...action.archivedGallery]
      }

    case UPDATE_GALLERY:
      return {
        ...state,
        gallery: [...action.gallery.concat(state.gallery)],
        totalGalleryItemsCount: state.totalGalleryItemsCount + action.gallery.length
      }

    case DELETE_GALLERY_ITEM:
      return {
        ...state,
        gallery: state.gallery.filter(item => item._id !== action.itemId)
      }

    case DELETE_ARCHIVED_GALLERY_ITEM:
      return {
        ...state,
        archivedGallery: state.archivedGallery.filter(item => item._id !== action.itemId)
      }

    case UPDATE_GALLERY_ITEM:
      return {
        ...state,
        gallery: state.gallery.map(item => {
          if (item._id === action.galleryItem._id) {
            item.tattooStyles = action.galleryItem.tattooStyles
          }

          return item
        })
      }

    case UPDATE_ARCHIVED_GALLERY_ITEM:
      return {
        ...state,
        archivedGallery: state.archivedGallery.map(item => {
          if (item._id === action.archivedGalleryItem._id) {
            item.tattooStyles = action.archivedGalleryItem.tattooStyles
          }

          return item
        })
      }

    case SET_SUCCESS_MODAL:
      return {
        ...state,
        successModal: {
          isSuccess: action.isSuccess,
          successText: action.text
        }
      }

    case SET_FAKE_API:
      return {
        ...state,
        fakeApi: action.fakeApi
      }

    case SET_API_ERROR:
      return {
        ...state,
        apiError: action.error
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetApiErrorAT | ToggleIsDeletingInProcessAT | SetSuccessModalAT |
    SetGalleryPageSizeAT | SetArchivedGalleryPageSizeAT | SetCurrentGalleryPageAT |
    SetCurrentArchivedGalleryPageAT | SetGalleryTotalCountAT | SetArchivedGalleryTotalCountAT |
    SetIsFetchingAT | SetTattooStylesAT | SetActiveStyleAT | SetGalleryAT | SetArchivedGalleryAT |
    UpdateGalleryAT | DeleteGalleryItemAT | DeleteArchivedGalleryItemAT | UpdateGalleryItemAT |
    UpdateArchivedGalleryItemAT | SetFakeApiAT

// actions creators

type SetApiErrorAT = {
  type: typeof  SET_API_ERROR
  error: string
};

export const setApiErrorAC = (error: string): SetApiErrorAT  => ({
  type: SET_API_ERROR, error
});

type SetSuccessModalAT = {
  type: typeof SET_SUCCESS_MODAL
  isSuccess: boolean
  text: string
}

export const setSuccessModalAC = (isSuccess: boolean, text: string): SetSuccessModalAT => ({
  type: SET_SUCCESS_MODAL, isSuccess, text
});

type SetFakeApiAT = {
  type: typeof SET_FAKE_API
  fakeApi: boolean
}

const setFakeApiAC = (fakeApi: boolean): SetFakeApiAT => ({
  type: SET_FAKE_API, fakeApi
});

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => (
    {
      type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type SetGalleryPageSizeAT = {
  type: typeof SET_GALLERY_PAGE_SIZE
  pageSize: number
}

export const setGalleryPageSizeAC = (pageSize: number): SetGalleryPageSizeAT => ({
    type: SET_GALLERY_PAGE_SIZE, pageSize
});

type SetArchivedGalleryPageSizeAT = {
  type: typeof SET_ARCHIVED_GALLERY_PAGE_SIZE
  pageSize: number
}

export const setArchivedGalleryPageSizeAC = (pageSize: number): SetArchivedGalleryPageSizeAT => ({
  type: SET_ARCHIVED_GALLERY_PAGE_SIZE, pageSize
});

type SetCurrentGalleryPageAT = {
  type: typeof SET_CURRENT_GALLERY_PAGE,
  page: number
}

export const setCurrentGalleryPageAC = (page: number): SetCurrentGalleryPageAT => ({
    type: SET_CURRENT_GALLERY_PAGE, page
});

type SetCurrentArchivedGalleryPageAT = {
  type: typeof SET_CURRENT_ARCHIVED_GALLERY_PAGE,
  page: number
}

export const setCurrentArchivedGalleryPageAC = (page: number): SetCurrentArchivedGalleryPageAT => ({
  type: SET_CURRENT_ARCHIVED_GALLERY_PAGE, page
});

type SetGalleryTotalCountAT = {
  type: typeof SET_GALLERY_TOTAL_COUNT,
  total: number
}

const setGalleryTotalCountAC = (total: number): SetGalleryTotalCountAT => ({
  type: SET_GALLERY_TOTAL_COUNT, total
});

type SetArchivedGalleryTotalCountAT = {
  type: typeof SET_ARCHIVED_GALLERY_TOTAL_COUNT,
  totalCount: number
}

const setArchivedGalleryTotalCountAC = (totalCount: number): SetArchivedGalleryTotalCountAT => ({
  type: SET_ARCHIVED_GALLERY_TOTAL_COUNT, totalCount
});

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
});

type SetTattooStylesAT = {
  type: typeof SET_STYLES,
  tattooStyles: Array<TattooStyleType>
}

const setTattooStylesAC = (tattooStyles: Array<TattooStyleType>): SetTattooStylesAT => ({
    type: SET_STYLES, tattooStyles
});

type SetActiveStyleAT = {
  type: typeof SET_ACTIVE_STYLE,
  style: TattooStyleType | null
}

export const setActiveStyleAC = (style: TattooStyleType | null): SetActiveStyleAT => ({
    type: SET_ACTIVE_STYLE, style
});

type SetGalleryAT = {
  type: typeof SET_GALLERY,
  gallery: Array<GalleryItemType>
}

const setGalleryAC = (gallery: Array<GalleryItemType>): SetGalleryAT => ({
    type: SET_GALLERY, gallery
});

type SetArchivedGalleryAT = {
  type: typeof SET_ARCHIVED_GALLERY,
  archivedGallery: Array<GalleryItemType>
}

const setArchivedGalleryAC = (archivedGallery: Array<GalleryItemType>): SetArchivedGalleryAT => ({
  type: SET_ARCHIVED_GALLERY, archivedGallery
});

type UpdateGalleryAT = {
  type: typeof UPDATE_GALLERY,
  gallery: Array<GalleryItemType>
}

const updateGalleryAC = (gallery: Array<GalleryItemType>): UpdateGalleryAT => ({
  type: UPDATE_GALLERY, gallery
});

type DeleteGalleryItemAT = {
  type: typeof DELETE_GALLERY_ITEM,
  itemId: string
}

const deleteGalleryItemAC = (itemId: string): DeleteGalleryItemAT => ({
  type: DELETE_GALLERY_ITEM, itemId
});

type DeleteArchivedGalleryItemAT = {
  type: typeof DELETE_ARCHIVED_GALLERY_ITEM
  itemId: string
}

const deleteArchivedGalleryItemAC = (itemId: string): DeleteArchivedGalleryItemAT => ({
  type: DELETE_ARCHIVED_GALLERY_ITEM, itemId
});

type UpdateGalleryItemAT = {
  type: typeof UPDATE_GALLERY_ITEM
  galleryItem: GalleryItemType
}

const updateGalleryItemAC = (galleryItem: GalleryItemType): UpdateGalleryItemAT => ({
  type: UPDATE_GALLERY_ITEM, galleryItem
});

type UpdateArchivedGalleryItemAT = {
  type: typeof UPDATE_ARCHIVED_GALLERY_ITEM
  archivedGalleryItem: GalleryItemType
}

const updateArchivedGalleryItemAC = (archivedGalleryItem: GalleryItemType): UpdateArchivedGalleryItemAT => ({
  type: UPDATE_ARCHIVED_GALLERY_ITEM, archivedGalleryItem
});


//thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

const deleteGalleryItemThunk = (
    id: string,
    styleId: string,
    gallery: Array<GalleryItemType>,
    currentPage: number,
    total: number,
    pageLimit: number
): ThunkType => async (dispatch) => {
  if (gallery.length > 1) {
    dispatch(deleteGalleryItemAC(id));
    dispatch(setGalleryTotalCountAC(total - 1));
  } else {
    const newPage = getNewPage(currentPage);
    dispatch(deleteGalleryItemAC(id));
    dispatch(setCurrentGalleryPageAC(newPage));
    if (currentPage === newPage) {
      await dispatch(getGallery(styleId, newPage, pageLimit));
    }
  }
}

const deleteArchivedGalleryItemThunk = (
    id: string,
    archivedGallery: Array<GalleryItemType>,
    currentPage: number,
    total: number,
    pageLimit: number
): ThunkType => async (dispatch) => {
  if (archivedGallery.length > 1) {
    dispatch(deleteArchivedGalleryItemAC(id));
    dispatch(setArchivedGalleryTotalCountAC(total - 1));
  } else {
    const newPage = getNewPage(currentPage);
    if (currentPage === newPage) {
      await dispatch(getArchivedGallery(newPage, pageLimit));
    }
    dispatch(deleteArchivedGalleryItemAC(id));
    dispatch(setCurrentArchivedGalleryPageAC(newPage));
  }
}

export const getTattooStyles = (): ThunkType => async (
  dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true))
    let response = await portfolioApi.getTattooStyles();
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFakeApiAC(false));
      dispatch(setTattooStylesAC(response.tattooStyles));
    }
  } catch (e) {
    console.log(e);
    dispatch(setTattooStylesAC(tattooStyles));
    dispatch(setFakeApiAC(true));
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const getGallery = (
    styleId: string,
    currentPage: number,
    pageSize: number
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await portfolioApi.getGalleryItems(styleId, currentPage, pageSize)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFakeApiAC(false));
      dispatch(setGalleryAC(response.gallery));
      dispatch(setGalleryTotalCountAC(response.totalCount));
    }
  } catch (e) {
    console.log(e)
    dispatch(setFakeApiAC(true))
    const galleryByStyle = gallery.filter((item) => item.tattooStyles.includes(styleId))
    dispatch(setGalleryAC(galleryByStyle));
    dispatch(setGalleryTotalCountAC(galleryByStyle.length));
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const addTattooStyle = (values: FormData): ThunkType => async (
    dispatch
) => {
  try {
    let response = await portfolioApi.addTattooStyle(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setActiveStyleAC(response.tattooStyle));
      dispatch(setSuccessModalAC(true, ADD_TATTOO_STYLE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}

export const editTattooStyle = (id: string, values: FormData): ThunkType => async (dispatch) => {
  try {
    let response = await portfolioApi.editTattooStyle(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setActiveStyleAC(response.tattooStyle));
      dispatch(setSuccessModalAC(true, UPDATE_TATTOO_STYLE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  }
}

export const deleteTattooStyle = (id: string): ThunkType => async (dispatch) => {
  try {
    let response = await portfolioApi.deleteTattooStyle(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      //dispatch(setTattooStylesAC(response.tattooStyles));
      dispatch(setActiveStyleAC(response.tattooStyles[0]));
    }

  } catch (e) {
    console.log(e);
  }
}

export const getArchivedGallery = (
    currentArchivedGalleryPage: number,
    archivedGalleryPageSize: number,
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true))
    let response = await portfolioApi.getArchivedGalleryItems(currentArchivedGalleryPage, archivedGalleryPageSize)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setArchivedGalleryAC(response.gallery));
      dispatch(setArchivedGalleryTotalCountAC(response.totalCount));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const resetActiveStyle = (
  style: TattooStyleType
): ThunkType => async (dispatch) => {
  dispatch(setActiveStyleAC(style));
  dispatch(setCurrentGalleryPageAC(1));
}

export const adminUpdateGallery = (
  tattooStyle: string,
  values: any
): ThunkType => async (dispatch) => {

  try {
    dispatch(setIsFetchingAC(true))
    let response = await portfolioApi.adminUpdateGallery(tattooStyle, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(updateGalleryAC(response.gallery));
      dispatch(setSuccessModalAC(true, ADD_GALLERY_ITEMS_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const deleteGalleryItem = (
  id: string,
  gallery: Array<GalleryItemType>,
  currentPage: number,
  total: number,
  pageLimit: number,
  style: TattooStyleType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await portfolioApi.deleteGalleryItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteGalleryItemThunk(id, style._id, gallery, currentPage, total, pageLimit))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const deleteArchivedGalleryItem = (
    id: string,
    gallery: Array<GalleryItemType>,
    currentPage: number,
    total: number,
    pageLimit: number
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await portfolioApi.deleteArchivedGalleryItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedGalleryItemThunk(id, gallery, currentPage, total, pageLimit))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const archiveGalleryItem = (
    id: string,
    gallery: Array<GalleryItemType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    style: TattooStyleType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await portfolioApi.archiveGalleryItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteGalleryItemThunk(id, style._id, gallery, currentPage, total, pageLimit))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const reactivateArchivedGalleryItem = (
    id: string,
    gallery: Array<GalleryItemType>,
    currentPage: number,
    total: number,
    pageLimit: number
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await portfolioApi.reactivateArchivedGalleryItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedGalleryItemThunk(id, gallery, currentPage, total, pageLimit))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const updateGalleryItem = (id: string, values: object): ThunkType => async (dispatch) => {
  try {
    let response = await portfolioApi.updateGalleryItem(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(updateGalleryItemAC(response.galleryItem));
      dispatch(setSuccessModalAC(true, EDIT_GALLERY_ITEM_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response.data.message));
    console.log(e);
  }
}

export const updateArchivedGalleryItem = (id: string, values: object): ThunkType => async (dispatch) => {
  try {
    let response = await portfolioApi.updateArchiveGalleryItem(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(updateArchivedGalleryItemAC(response.archivedGalleryItem));
      dispatch(setSuccessModalAC(true, EDIT_GALLERY_ITEM_SUCCESS));
    }
  } catch (e) {
    console.log(e);
  }
}
