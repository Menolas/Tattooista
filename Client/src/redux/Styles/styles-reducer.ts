import {stylesApi} from "./StylesApi";
import {StyleType} from "../../types/Types";
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "../redux-store";
import {ResultCodesEnum} from "../../utils/constants";
import {tattooStyles} from "../../data/StylesData";
import {
  setSuccessModalAC,
  SetSuccessModalAT,
  setApiErrorAC,
  SetApiErrorAT} from "../General/general-reducer";

const SET_STYLES = 'SET_STYLES';
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING';
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS';
const SET_ACTIVE_STYLE = 'SET_ACTIVE_STYLE';
const ADD_TATTOO_STYLE_SUCCESS = 'You successfully added a new Tattoo style to your gallery.';
const UPDATE_TATTOO_STYLE_SUCCESS = 'You successfully updated Tattoo style in your gallery.';

let initialState = {
  isFetching: false as boolean,
  isDeletingInProcess: [] as Array<string>,
  styles: [] as Array<StyleType>,
  activeStyle: {} as StyleType | null,
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
        styles: action.styles
      }

    case SET_ACTIVE_STYLE:

      return {
        ...state,
        activeStyle: action.style,
        //currentGalleryPage: 1
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = ToggleIsDeletingInProcessAT | SetIsFetchingAT |
    SetStylesAT | SetActiveStyleAT | SetSuccessModalAT | SetApiErrorAT;

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

type SetActiveStyleAT = {
  type: typeof SET_ACTIVE_STYLE,
  style: StyleType | null
}

export const setActiveStyleAC = (style: StyleType | null): SetActiveStyleAT => ({
    type: SET_ACTIVE_STYLE, style
});

//thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getTattooStyles = (token: string | null): ThunkType => async (
  dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true))
    let response = await stylesApi.getTattooStyles(token);
    if (response.resultCode === ResultCodesEnum.Success) {
      //dispatch(setFakeApiAC(false));
      dispatch(setStylesAC(response.tattooStyles));
    }
  } catch (e) {
    console.log(e);
    dispatch(setStylesAC(tattooStyles));
    //dispatch(setFakeApiAC(true));
  } finally {
    dispatch(setIsFetchingAC(false));
  }
}

export const addTattooStyle = (values: FormData): ThunkType => async (
    dispatch
) => {
  try {
    let response = await stylesApi.addTattooStyle(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setActiveStyleAC(response.tattooStyle));
      dispatch(setSuccessModalAC(true, ADD_TATTOO_STYLE_SUCCESS));
    }
  } catch (e: any) {
    dispatch(setApiErrorAC(e.response?.data?.message || 'An error occurred'));
    console.log(e.response?.data?.message);
  }
}

export const editTattooStyle = (id: string, values: FormData): ThunkType => async (dispatch) => {
  try {
    let response = await stylesApi.editTattooStyle(id, values)
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
    dispatch(toggleIsDeletingInProcessAC(true, id));
    let response = await stylesApi.deleteTattooStyle(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setActiveStyleAC(response.tattooStyles[0]));
    }

  } catch (e) {
    console.log(e);
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id));
  }
}

export const resetActiveStyle = (
  style: StyleType
): ThunkType => async (dispatch) => {
  dispatch(setActiveStyleAC(style));
}
