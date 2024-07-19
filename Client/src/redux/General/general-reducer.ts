const SET_API_ERROR = 'SET_API_ERROR';
const SET_SUCCESS_MODAL = 'SET_SUCCESS_MODAL';

const initialState = {
  apiError: null as null | string,
  successModal: {
    isSuccess: false as boolean,
    successText: '' as string,
  }
}

export type InitialStateType = typeof initialState;

export const generalReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {

  switch (action.type) {

    case SET_SUCCESS_MODAL:
      return {
        ...state,
        successModal: {
          isSuccess: action.isSuccess,
          successText: action.text
        }
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

type ActionsTypes = SetApiErrorAT | SetSuccessModalAT;

// action creators

export type SetSuccessModalAT = {
  type: typeof SET_SUCCESS_MODAL
  isSuccess: boolean
  text: string
}

export const setSuccessModalAC = (isSuccess: boolean, text: string): SetSuccessModalAT => ({
  type: SET_SUCCESS_MODAL, isSuccess, text
});

export type SetApiErrorAT = {
  type: typeof  SET_API_ERROR
  error: null | string
};

export const setApiErrorAC = (error: null | string): SetApiErrorAT  => ({
  type: SET_API_ERROR, error
});
