import { galleryApi } from "./GalleryApi";
import {StyleType, GalleryItemType, ApiErrorType} from "../../types/Types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "../redux-store";
import {ResultCodesEnum} from "../../utils/constants";
import {getNewPage} from "../../utils/functions";
import { gallery } from "../../data/GalleryData";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT
} from "../General/general-reducer";

const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS';
const SET_GALLERY = 'SET_GALLERY';
const UPDATE_GALLERY = 'UPDATE_GALLERY';
const UPDATE_GALLERY_ITEM = 'UPDATE_GALLERY_ITEM';
const DELETE_GALLERY_ITEM = 'DELETE_GALLERY_ITEM';

const ADD_GALLERY_ITEMS_SUCCESS = 'You successfully added gallery images';
const EDIT_GALLERY_ITEM_SUCCESS = 'You successfully edited gallery image';

const initialState = {
  totalCount: 0 as number,
  pageSize: 8 as number,
  currentPage: 1 as number,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  gallery: [] as GalleryItemType[],
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
        gallery: action.gallery,
        totalCount: action.total,
      }

    case UPDATE_GALLERY:
      return {
        ...state,
        gallery: [...action.gallery, ...state.gallery],
        totalCount: state.totalCount + action.gallery.length
      }

    case DELETE_GALLERY_ITEM:
      return {
        ...state,
        gallery: state.gallery.filter(item => item?._id !== action.itemId),
        totalCount: state.totalCount - 1
      }

    case UPDATE_GALLERY_ITEM:
      return {
        ...state,
        gallery: state.gallery.map(item => {
          if (item && item?._id === action.galleryItem._id) {
            if (action.isInGallery) {
              return {
                ...item,
                tattooStyles: action.galleryItem.tattooStyles,
              }
            } else {
              return null
            }
          }
          return item;
        })
        .filter((item): item is GalleryItemType => item !== null),
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetApiErrorAT | ToggleIsDeletingInProcessAT | SetSuccessModalAT |
    SetGalleryPageSizeAT | SetCurrentGalleryPageAT | SetIsFetchingAT | SetGalleryAT
    | UpdateGalleryAT | DeleteGalleryItemAT | UpdateGalleryItemAT;

// actions creators

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS;
  isFetching: boolean;
  id: string;
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => (
    {
      type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type SetGalleryPageSizeAT = {
  type: typeof SET_PAGE_SIZE;
  pageSize: number;
};

export const setGalleryPageSizeAC = (pageSize: number): SetGalleryPageSizeAT => ({
    type: SET_PAGE_SIZE, pageSize
});

export type SetCurrentGalleryPageAT = {
  type: typeof SET_CURRENT_PAGE;
  page: number;
};

export const setCurrentGalleryPageAC = (page: number): SetCurrentGalleryPageAT => ({
    type: SET_CURRENT_PAGE, page
});

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING;
  isFetching: boolean;
};

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
});

type SetGalleryAT = {
  type: typeof SET_GALLERY;
  gallery: Array<GalleryItemType>;
  total: number;
};

const setGalleryAC = (gallery: Array<GalleryItemType>, total: number): SetGalleryAT => ({
    type: SET_GALLERY, gallery, total
});

type UpdateGalleryAT = {
  type: typeof UPDATE_GALLERY;
  gallery: Array<GalleryItemType>;
};

const updateGalleryAC = (gallery: Array<GalleryItemType>): UpdateGalleryAT => ({
  type: UPDATE_GALLERY, gallery
});

type DeleteGalleryItemAT = {
  type: typeof DELETE_GALLERY_ITEM;
  itemId: string;
};

const deleteGalleryItemAC = (itemId: string): DeleteGalleryItemAT => ({
  type: DELETE_GALLERY_ITEM, itemId
});

type UpdateGalleryItemAT = {
  type: typeof UPDATE_GALLERY_ITEM;
  galleryItem: GalleryItemType;
  isInGallery: boolean;
};

const updateGalleryItemAC = (
    galleryItem: GalleryItemType,
    isInGallery: boolean,
): UpdateGalleryItemAT => ({
  type: UPDATE_GALLERY_ITEM, galleryItem, isInGallery
});

//thunks

type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, ActionsTypes>;

const deleteGalleryItemThunk = (
    id: string,
    styleId: string,
    gallery: Array<GalleryItemType>,
    currentPage: number,
    pageLimit: number
): ThunkType => async (dispatch) => {
  if (gallery.length > 1) {
    dispatch(deleteGalleryItemAC(id));
  } else {
    const newPage = getNewPage(currentPage);
    dispatch(deleteGalleryItemAC(id));
    dispatch(setCurrentGalleryPageAC(newPage));
    if (currentPage === newPage) {
      await dispatch(getGallery(styleId, newPage, pageLimit));
    }
  }
  return true;
};

export const getGallery = (
    styleId: string,
    currentPage: number,
    pageSize: number
): ThunkType => async (
    dispatch
) => {
  dispatch(setIsFetchingAC(true));
  dispatch(setApiErrorAC(null));
  try {
    const response = await galleryApi.getGalleryItems(styleId, currentPage, pageSize)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setGalleryAC(response.gallery, response.totalCount));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message || 'An error occurred'));
    console.log(error);
    const galleryByStyle = gallery.filter(
        (item) => item.tattooStyles.includes(styleId));
    dispatch(setGalleryAC(galleryByStyle, galleryByStyle.length));
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const updateGallery = (
  tattooStyle: string,
  values: FormData
): ThunkType => async (dispatch) => {

  try {
    dispatch(setIsFetchingAC(true));
    const response = await galleryApi.adminUpdateGallery(tattooStyle, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(updateGalleryAC(response.gallery));
      setApiErrorAC(null);
      dispatch(setSuccessModalAC(true, ADD_GALLERY_ITEMS_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message || 'An error occurred'));
    console.log(error);
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const deleteGalleryItem = (
  id: string,
  gallery: Array<GalleryItemType>,
  currentPage: number,
  pageLimit: number,
  style: StyleType
): ThunkType => async (dispatch) => {
  dispatch(toggleIsDeletingInProcessAC(true, id));
  try {
    const response = await galleryApi.deleteGalleryItem(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteGalleryItemThunk(id, style._id, gallery, currentPage, pageLimit));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return  false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};

export const archiveGalleryItem = (
    id: string,
    gallery: Array<GalleryItemType>,
    currentPage: number,
    pageLimit: number,
    style: StyleType
): ThunkType => async (dispatch) => {
  dispatch(toggleIsDeletingInProcessAC(true, id));
  try {
    const response = await galleryApi.archiveGalleryItem(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteGalleryItemThunk(id, style._id, gallery, currentPage, pageLimit));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};

type ValuesType = {
  [key: string]: boolean;
};

export const updateGalleryItem = (
    id: string,
    values: ValuesType,
    activeStyleId: string,
): ThunkType => async (dispatch) => {
  try {
    const response = await galleryApi.updateGalleryItem(id, values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(updateGalleryItemAC(response.galleryItem, values[activeStyleId]));
      dispatch(setSuccessModalAC(true, EDIT_GALLERY_ITEM_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response.data.message));
    console.log(error);
    return false;
  }
};
