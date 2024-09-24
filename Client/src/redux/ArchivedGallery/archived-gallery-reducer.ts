import {archivedGalleryApi} from "./ArchivedGalleryApi";
import {ApiErrorType, GalleryItemType} from "../../types/Types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "../redux-store";
import {ResultCodesEnum} from "../../utils/constants";
import {getNewPage} from "../../utils/functions";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";

const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const UPDATE_ARCHIVED_GALLERY_ITEM = 'UPDATE_ARCHIVED_GALLERY_ITEM';
const SET_ARCHIVED_GALLERY = 'SET_ARCHIVED_GALLERY';
const DELETE_ARCHIVED_GALLERY_ITEM = 'DELETE_ARCHIVED_GALLERY_ITEM';

//const EDIT_GALLERY_ITEM_SUCCESS = 'You successfully edited gallery image';
const RESTORE_GALLERY_ITEM_FROM_ARCHIVE = 'You successfully restored gallery image';

const initialState = {
  totalCount: 0 as number,
  pageSize: 16 as number,
  currentPage: 1 as number,
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  archivedGallery: [] as Array<GalleryItemType>,
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

export const archivedGalleryReducer = (
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

    case SET_ARCHIVED_GALLERY:
      return {
        ...state,
        archivedGallery: [...action.archivedGallery]
      }

    case DELETE_ARCHIVED_GALLERY_ITEM:
      return {
        ...state,
        archivedGallery: state.archivedGallery.filter(item => item._id !== action.itemId),
        totalCount: state.totalCount - 1,
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

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetApiErrorAT | ToggleIsDeletingInProcessAT |
    SetSuccessModalAT | SetPageSizeAT | SetCurrentPageAT | SetIsFetchingAT
    | SetArchivedGalleryAT | DeleteArchivedGalleryItemAT |
    UpdateArchivedGalleryItemAT;

// actions creators

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS;
  isFetching: boolean;
  id: string;
};

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => (
    {
      type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type SetPageSizeAT = {
  type: typeof SET_PAGE_SIZE;
  pageSize: number;
};

export const setPageSizeAC = (pageSize: number): SetPageSizeAT => ({
  type: SET_PAGE_SIZE, pageSize
});

type SetCurrentPageAT = {
  type: typeof SET_CURRENT_PAGE;
  page: number;
};

export const setCurrentPageAC = (page: number): SetCurrentPageAT => ({
  type: SET_CURRENT_PAGE, page
});

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING;
  isFetching: boolean;
};

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
});

type SetArchivedGalleryAT = {
  type: typeof SET_ARCHIVED_GALLERY;
  archivedGallery: Array<GalleryItemType>;
  total: number;
};

const setArchivedGalleryAC = (archivedGallery: Array<GalleryItemType>, total: number): SetArchivedGalleryAT => ({
  type: SET_ARCHIVED_GALLERY, archivedGallery, total
});

type DeleteArchivedGalleryItemAT = {
  type: typeof DELETE_ARCHIVED_GALLERY_ITEM;
  itemId: string;
};

const deleteArchivedGalleryItemAC = (itemId: string): DeleteArchivedGalleryItemAT => ({
  type: DELETE_ARCHIVED_GALLERY_ITEM, itemId
});

type UpdateArchivedGalleryItemAT = {
  type: typeof UPDATE_ARCHIVED_GALLERY_ITEM;
  archivedGalleryItem: GalleryItemType;
};

// const updateArchivedGalleryItemAC = (archivedGalleryItem: GalleryItemType): UpdateArchivedGalleryItemAT => ({
//   type: UPDATE_ARCHIVED_GALLERY_ITEM, archivedGalleryItem
// });


//thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>;

const deleteArchivedGalleryItemThunk = (
    id: string,
    archivedGallery: Array<GalleryItemType>,
    currentPage: number,
    pageLimit: number
): ThunkType => async (dispatch) => {
  if (archivedGallery.length > 1) {
    dispatch(deleteArchivedGalleryItemAC(id));
  } else {
    const newPage = getNewPage(currentPage);
    if (currentPage === newPage) {
      await dispatch(getArchivedGallery(newPage, pageLimit));
    }
    dispatch(deleteArchivedGalleryItemAC(id));
    dispatch(setCurrentPageAC(newPage));
  }
};

export const getArchivedGallery = (
    currentArchivedGalleryPage: number,
    archivedGalleryPageSize: number,
): ThunkType => async (dispatch) => {
  try {
    dispatch(setIsFetchingAC(true))
    const response = await archivedGalleryApi.getArchivedGalleryItems(currentArchivedGalleryPage, archivedGalleryPageSize)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setArchivedGalleryAC(response.gallery, response.totalCount));
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(setIsFetchingAC(false));
  }
};

export const deleteArchivedGalleryItem = (
    id: string,
    gallery: Array<GalleryItemType>,
    currentPage: number,
    pageLimit: number
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await archivedGalleryApi.deleteArchivedGalleryItem(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedGalleryItemThunk(id, gallery, currentPage, pageLimit));
      dispatch(setApiErrorAC(null));
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message || 'An error occurred'));
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};

export const reactivateArchivedGalleryItem = (
    id: string,
    gallery: Array<GalleryItemType>,
    currentPage: number,
    pageLimit: number
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await archivedGalleryApi.reactivateArchivedGalleryItem(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      await dispatch(deleteArchivedGalleryItemThunk(id, gallery, currentPage, pageLimit));
      dispatch(setApiErrorAC(null));
      dispatch(setSuccessModalAC(true, RESTORE_GALLERY_ITEM_FROM_ARCHIVE));
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message || 'An error occurred'));
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
};
