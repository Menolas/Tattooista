import { galleryApi } from "./GalleryApi";
import { StyleType, GalleryItemType } from "../../types/Types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "../redux-store";
import {ResultCodesEnum} from "../../utils/constants";
import {getNewPage} from "../../utils/functions";
import { gallery } from "../../data/GalleryData";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";

const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const SET_TOTAL = 'SET_TOTAL';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS';
const SET_GALLERY = 'SET_GALLERY';
const UPDATE_GALLERY = 'UPDATE_GALLERY';
const UPDATE_GALLERY_ITEM = 'UPDATE_GALLERY_ITEM';
const DELETE_GALLERY_ITEM = 'DELETE_GALLERY_ITEM';
const SET_FAKE_API = 'SET_FAKE_API';

const ADD_GALLERY_ITEMS_SUCCESS = 'You successfully added gallery images';
const EDIT_GALLERY_ITEM_SUCCESS = 'You successfully edited gallery image';

let initialState = {
  totalCount: 0 as number,
  pageSize: 16 as number | null,
  currentPage: 1 as number,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  gallery: [] as Array<GalleryItemType>,
  fakeApi: false as boolean,
}

export type InitialStateType = typeof initialState;

//Black@Gray Black-and-gray is sometimes referred to as "jailhouse" or "joint style" and is thought to have originated in prisons where inmates had limited access to different materials; they resorted to using guitar strings for needles and used cigarette ashes or pen ink to produce tattoos.
//FineLine Fine line tattooing consists of distinct straight or curved thin lines, without gradations in shade or color to represent 2D or 3D objects, emphasizing form and outline over color, shading, and texture. These tattoos can have incredible levels of detail built in, without being 'loud' about it
//BlackWork A blackwork tattoo is a bold work of body art rendered in solid planes of black ink. Usually, these tattoos are composed of abstract patterns and geometric shapes, though some feature figurative forms and recognizable scenes and subjects.
//NeoTraditional Neo-traditional tattoo designs feature bold, dark outlines and illustrative looks. There is a feeling of subtle dimension and the use of saturated colors. This dimension is not a 3D type of tattoo, yet they contain lines that vary in weight. This style of tattoo art consists of an illustrated look.
//Realistic Realism tattoos can depict anything, with the only requirement being that the tattoo looks as close to photorealistic as possible. Portraits of famous people, loved ones, nature, and meaningful objects are all common choices for realistic tattoos.
//Designs Here you can see some of my designs and drawings.
//OldSchool
//No style Here the images of tattoos which difficult to define which style it is actually

export const galleryReducer = (
  state = initialState,
  action: ActionsTypes): InitialStateType => {

  switch (action.type) {
    case SET_PAGE_SIZE:
      return {
        ...state,
        pageSize: action.pageSize,
        currentPage: 1
      }

    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.page
      }

    case SET_TOTAL:
      return {
        ...state,
        totalCount: action.total
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

    case SET_GALLERY:
      return {
        ...state,
        gallery: action.gallery
      }

    case UPDATE_GALLERY:
      return {
        ...state,
        gallery: [...action.gallery.concat(state.gallery)],
        totalCount: state.totalCount + action.gallery.length
      }

    case DELETE_GALLERY_ITEM:
      return {
        ...state,
        gallery: state.gallery.filter(item => item._id !== action.itemId)
      }

    case UPDATE_GALLERY_ITEM:
      return {
        ...state,
        gallery: state.gallery.map(item => {
          if (item._id === action.galleryItem._id) {
            item.tattooStyles = action.galleryItem.tattooStyles
          }
          return item;
        })
      }

    case SET_FAKE_API:
      return {
        ...state,
        fakeApi: action.fakeApi
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetApiErrorAT | ToggleIsDeletingInProcessAT | SetSuccessModalAT |
    SetGalleryPageSizeAT | SetCurrentGalleryPageAT | SetGalleryTotalCountAT |
    SetIsFetchingAT | SetGalleryAT | UpdateGalleryAT | DeleteGalleryItemAT |
    UpdateGalleryItemAT | SetFakeApiAT;

// actions creators

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
  type: typeof SET_PAGE_SIZE
  pageSize: number
}

export const setGalleryPageSizeAC = (pageSize: number): SetGalleryPageSizeAT => ({
    type: SET_PAGE_SIZE, pageSize
});

type SetCurrentGalleryPageAT = {
  type: typeof SET_CURRENT_PAGE,
  page: number
}

export const setCurrentGalleryPageAC = (page: number): SetCurrentGalleryPageAT => ({
    type: SET_CURRENT_PAGE, page
});

type SetGalleryTotalCountAT = {
  type: typeof SET_TOTAL,
  total: number
}

const setGalleryTotalCountAC = (total: number): SetGalleryTotalCountAT => ({
  type: SET_TOTAL, total
});

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
});

type SetGalleryAT = {
  type: typeof SET_GALLERY,
  gallery: Array<GalleryItemType>
}

const setGalleryAC = (gallery: Array<GalleryItemType>): SetGalleryAT => ({
    type: SET_GALLERY, gallery
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

type UpdateGalleryItemAT = {
  type: typeof UPDATE_GALLERY_ITEM
  galleryItem: GalleryItemType
}

const updateGalleryItemAC = (galleryItem: GalleryItemType): UpdateGalleryItemAT => ({
  type: UPDATE_GALLERY_ITEM, galleryItem
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

export const getGallery = (
    styleId: string,
    currentPage: number,
    pageSize: number
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true));
    let response = await galleryApi.getGalleryItems(styleId, currentPage, pageSize)
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

export const adminUpdateGallery = (
  tattooStyle: string,
  values: FormData
): ThunkType => async (dispatch) => {

  try {
    dispatch(setIsFetchingAC(true));
    let response = await galleryApi.adminUpdateGallery(tattooStyle, values);
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
  style: StyleType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await galleryApi.deleteGalleryItem(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteGalleryItemThunk(id, style._id, gallery, currentPage, total, pageLimit));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const archiveGalleryItem = (
    id: string,
    gallery: Array<GalleryItemType>,
    currentPage: number,
    total: number,
    pageLimit: number,
    style: StyleType
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await galleryApi.archiveGalleryItem(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteGalleryItemThunk(id, style._id, gallery, currentPage, total, pageLimit));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const updateGalleryItem = (id: string, values: object): ThunkType => async (dispatch) => {
  try {
    let response = await galleryApi.updateGalleryItem(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(updateGalleryItemAC(response.galleryItem));
      dispatch(setSuccessModalAC(true, EDIT_GALLERY_ITEM_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response.data.message));
    console.log(e);
  }
}
