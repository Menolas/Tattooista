import { getAuthAdminData } from './Auth/auth-reducer'
import {ThunkAction} from "redux-thunk";
import {AppStateType} from "./redux-store";

const INITIALIZED_SUCCESS = 'INITIALIZED_SUCCESS'

let initialState = {
  initialized: false
}

export type InitialStateType = typeof initialState

export const appReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {
    case INITIALIZED_SUCCESS:
      return {
        ...state,
        initialized: true
      };

    default:
      return state
  }
}

type ActionsTypes = InitializedSuccessActionType

type InitializedSuccessActionType = {
  type: typeof INITIALIZED_SUCCESS
}
export const initializedSuccess = (): InitializedSuccessActionType => (
    { type: INITIALIZED_SUCCESS }
)

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const initializeApp = (token: string): ThunkType => async  (
    dispatch
) => {
  let promise = dispatch(getAuthAdminData(token));
  Promise.all([promise])
    .then(() => {
      dispatch(initializedSuccess())
    })
}
