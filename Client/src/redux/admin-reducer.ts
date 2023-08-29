const SET_PAGE_URL = 'SET_PAGE_URL'

export type InitialStateType = {
  pageUrl: string
}

let initialState: InitialStateType = {
  pageUrl: 'customers'
}

export const adminReducer = (state = initialState, action: ActionTypes): InitialStateType => {

  switch (action.type) {
    case SET_PAGE_URL:
      return {
        ...state,
        pageUrl: action.pageUrl,
      }
    default: return state
  }
}

type ActionTypes = SetPageUrlActionType

type SetPageUrlActionType = {
  type: typeof SET_PAGE_URL
  pageUrl: string
}

export const setPageUrl = (pageUrl: string): SetPageUrlActionType => (
  {
    type: SET_PAGE_URL, pageUrl
  }
)
