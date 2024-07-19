import {stylesApi} from "./StylesApi";
import {ApiErrorType, StyleType} from "../../types/Types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "../redux-store";
import {ResultCodesEnum} from "../../utils/constants";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";
import {
  SetCurrentGalleryPageAT,
  setCurrentGalleryPageAC,
} from "../Gallery/gallery-reducer";
import {checkAuth, LogInAT} from "../Auth/auth-reducer";
import {tattooStyles} from "../../data/StylesData";

const SET_STYLES = 'SET_STYLES';
const DELETE_STYLE = 'DELETE_STYLE';
const ADD_STYLE = 'ADD_STYLE';
const UPDATE_STYLE = 'UPDATE_STYLE';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_DELETING_IN_PROCESS';
const SET_ACTIVE_STYLE = 'SET_ACTIVE_STYLE';

const ADD_STYLE_SUCCESS = 'You successfully added a new Tattoo style to your gallery.';
const UPDATE_STYLE_SUCCESS = 'You successfully updated Tattoo style in your gallery.';

const initialState = {
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  styles: [] as Array<StyleType>,
  activeStyle: null as StyleType | null,
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

export const stylesReducer = (
  state = initialState,
  action: ActionsTypes): InitialStateType => {

  switch (action.type) {

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
        styles: action.styles,
      }

    case DELETE_STYLE: {
      const updatedStyles = state.styles.filter(style => style._id !== action.id);
      return {
        ...state,
        styles: updatedStyles,
        activeStyle: updatedStyles[0],
      };
    }

    case ADD_STYLE:
      return {
        ...state,
        styles: [{...action.style}, ...state.styles],
        activeStyle: action.style,
      }

    case UPDATE_STYLE:
      return {
        ...state,
        styles: state.styles.map(style => {
          if (style._id === action.style._id) {
            return {...action.style};
          }
          return style;
        }),
        activeStyle: action.style,
      }

    case SET_ACTIVE_STYLE:

      return {
        ...state,
        activeStyle: action.style,
      }

    default: return {
      ...state,
    }
  }
}

type ActionsTypes = ToggleIsDeletingInProcessAT | SetIsFetchingAT |
    SetStylesAT | DeleteStyleAT | SetActiveStyleAT | SetSuccessModalAT | SetApiErrorAT |
    LogInAT | AddStyleAT | UpdateStyleAT | SetCurrentGalleryPageAT;

// actions creators

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => (
    {
      type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
});

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
});

type SetStylesAT = {
  type: typeof SET_STYLES,
  styles: Array<StyleType>
}

const setStylesAC = (styles: Array<StyleType>): SetStylesAT => ({
    type: SET_STYLES, styles
});

type DeleteStyleAT = {
  type: typeof DELETE_STYLE,
  id: string
}

const deleteStyleAC = (id: string): DeleteStyleAT => ({
    type: DELETE_STYLE, id
});

type AddStyleAT = {
  type: typeof ADD_STYLE,
  style: StyleType
}

export const addStyleAC = (style: StyleType): AddStyleAT => ({
    type: ADD_STYLE, style
});

type UpdateStyleAT = {
    type: typeof UPDATE_STYLE, style: StyleType
}

export const updateStyleAC = (style: StyleType): UpdateStyleAT => ({
    type: UPDATE_STYLE, style
});

type SetActiveStyleAT = {
  type: typeof SET_ACTIVE_STYLE,
  style: StyleType | null
}

export const setActiveStyleAC = (style: StyleType | null): SetActiveStyleAT => ({
    type: SET_ACTIVE_STYLE, style
});

//thunks

type ThunkType = ThunkAction<Promise<boolean>, AppStateType, unknown, ActionsTypes>

export const setActiveStyle = (style: StyleType | null): ThunkType => async (
    dispatch
) => {
  dispatch(setActiveStyleAC(style));
  dispatch(setCurrentGalleryPageAC(1));
  return true;
}

export const getStyles = (
    token: string | null | undefined,
    isSlider?: boolean
): ThunkType => async (
  dispatch
) => {
  dispatch(setIsFetchingAC(true));
  try {
    const getStylesResponse = await stylesApi.getStyles(token, isSlider)
    if (getStylesResponse.resultCode === ResultCodesEnum.Success) {
      dispatch(setStylesAC(getStylesResponse.tattooStyles));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    await dispatch(checkAuth());
    dispatch(setStylesAC(tattooStyles));
    return false;
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const addStyle = (values: FormData): ThunkType => async (
    dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true));
    const response = await stylesApi.addStyle(values);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(addStyleAC(response.tattooStyle));
      dispatch(setSuccessModalAC(true, ADD_STYLE_SUCCESS));
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
}

export const editStyle = (
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    const response = await stylesApi.editStyle(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(updateStyleAC(response.tattooStyle));
      dispatch(setSuccessModalAC(true, UPDATE_STYLE_SUCCESS));
      return true;
    } else {
      return false;
    }
  } catch (e) {
    const error = e as ApiErrorType;
    dispatch(setApiErrorAC(error.response?.data?.message || 'An error occurred'));
    console.log(error);
    return false;
  }
}

export const deleteStyle = (id: string): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id));
    const response = await stylesApi.deleteStyle(id);
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteStyleAC(id));
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
}
