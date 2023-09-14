import { portfolioApi } from './PortfolioApi'
import { TattooStyleType, GalleryItemType } from '../../types/Types'
import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {ResultCodesEnum} from '../../utils/constants'

const SET_GALLERY_PAGE_SIZE = 'SET_GALLERY_PAGE_SIZE'
const SET_ARCHIVED_GALLERY_PAGE_SIZE = 'SET_ARCHIVED_GALLERY_PAGE_SIZE'
const SET_CURRENT_GALLERY_PAGE = 'SET_CURRENT_GALLERY_PAGE'
const SET_CURRENT_ARCHIVED_GALLERY_PAGE = 'SET_CURRENT_ARCHIVED_GALLERY_PAGE'
const SET_GALLERY_TOTAL_COUNT = 'SET_GALLERY_TOTAL_COUNT'
const SET_ARCHIVED_GALLERY_TOTAL_COUNT = 'SET_ARCHIVED_GALLERY_TOTAL_COUNT'
const SET_STYLES = 'SET_STYLES'
const TOGGLE_IS_FETCHING = 'TOGGLE_IS_FETCHING'
const TOGGLE_IS_DELETING_IN_PROCESS = 'TOGGLE_IS_CONSULTATION_DELETING_IN_PROCESS'
const SET_ACTIVE_STYLE = 'SET_ACTIVE_STYLE'
const SET_GALLERY = 'SET_GALLERY'
const SET_ARCHIVED_GALLERY = 'SET_ARCHIVED_GALLERY'
const DELETE_GALLERY_ITEM = 'DELETE_GALLERY_ITEM'
const DELETE_ARCHIVED_GALLERY_ITEM = 'DELETE_ARCHIVED_GALLERY_ITEM'
const SET_IS_SUCCESS = 'SET_IS_SUCCESS'

let initialState = {
  totalGalleryItemsCount: 0 as number | null,
  totalArchivedGalleryItemsCount: 0 as number | null,
  galleryPageSize: 4 as number | null,
  archivedGalleryPageSize: 5 as number,
  currentGalleryPage: 1 as number | null,
  currentArchivedGalleryPage: 1 as number,
  isFetching: false,
  isDeletingInProcess: [] as Array<string>,
  tattooStyles: [] as Array<TattooStyleType>,
  activeStyle: {} as TattooStyleType | null,
  gallery: [] as Array<GalleryItemType>,
  archivedGallery: [] as Array<GalleryItemType>,
  isSuccess: false as boolean
}

export type InitialStateType = typeof initialState

//Black@Gray
//FineLine
//BlackWork
//NeoTraditional
//Realistic
//Designs
//OldSchool

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

    case SET_IS_SUCCESS:
      return {
        ...state,
        isSuccess: action.isSuccess
      }

    default: return {
      ...state
    }
  }
}

//action creators

type ActionsTypes = ToggleIsDeletingInProcessAT | SetIsSuccessAT | SetGalleryPageSizeAT | SetArchivedGalleryPageSizeAT |
    SetCurrentGalleryPageAT | SetCurrentArchivedGalleryPageAT | SetGalleryTotalCountAT |
    SetArchivedGalleryTotalCountAT | SetIsFetchingAT | SetTattooStylesAT | SetActiveStyleAT |
    SetGalleryAT | SetArchivedGalleryAT | DeleteGalleryItemAT | DeleteArchivedGalleryItemAT

// actions creators

type ToggleIsDeletingInProcessAT = {
  type: typeof TOGGLE_IS_DELETING_IN_PROCESS,
  isFetching: boolean,
  id: string
}

const toggleIsDeletingInProcessAC = (isFetching: boolean, id: string): ToggleIsDeletingInProcessAT => (
    {
      type: TOGGLE_IS_DELETING_IN_PROCESS, isFetching, id
    }
)

type SetIsSuccessAT = {
  type: typeof SET_IS_SUCCESS
  isSuccess: boolean
}

export const setIsSuccessAC = (isSuccess: boolean): SetIsSuccessAT => ({
  type: SET_IS_SUCCESS, isSuccess
})

type SetGalleryPageSizeAT = {
  type: typeof SET_GALLERY_PAGE_SIZE
  pageSize: number
}

export const setGalleryPageSizeAC = (pageSize: number): SetGalleryPageSizeAT => ({
    type: SET_GALLERY_PAGE_SIZE, pageSize
})

type SetArchivedGalleryPageSizeAT = {
  type: typeof SET_ARCHIVED_GALLERY_PAGE_SIZE
  pageSize: number
}

export const setArchivedGalleryPageSizeAC = (pageSize: number): SetArchivedGalleryPageSizeAT => ({
  type: SET_ARCHIVED_GALLERY_PAGE_SIZE, pageSize
})

type SetCurrentGalleryPageAT = {
  type: typeof SET_CURRENT_GALLERY_PAGE,
  page: number
}

export const setCurrentGalleryPageAC = (page: number): SetCurrentGalleryPageAT => ({
    type: SET_CURRENT_GALLERY_PAGE, page
})

type SetCurrentArchivedGalleryPageAT = {
  type: typeof SET_CURRENT_ARCHIVED_GALLERY_PAGE,
  page: number
}

export const setCurrentArchivedGalleryPageAC = (page: number): SetCurrentArchivedGalleryPageAT => ({
  type: SET_CURRENT_ARCHIVED_GALLERY_PAGE, page
})

type SetGalleryTotalCountAT = {
  type: typeof SET_GALLERY_TOTAL_COUNT,
  total: number
}

const setGalleryTotalCountAC = (total: number): SetGalleryTotalCountAT => ({
  type: SET_GALLERY_TOTAL_COUNT, total
})

type SetArchivedGalleryTotalCountAT = {
  type: typeof SET_ARCHIVED_GALLERY_TOTAL_COUNT,
  totalCount: number
}

const setArchivedGalleryTotalCountAC = (totalCount: number): SetArchivedGalleryTotalCountAT => ({
  type: SET_ARCHIVED_GALLERY_TOTAL_COUNT, totalCount
})

type SetIsFetchingAT = {
  type: typeof TOGGLE_IS_FETCHING,
  isFetching: boolean
}

const setIsFetchingAC = (isFetching: boolean): SetIsFetchingAT => ({
    type: TOGGLE_IS_FETCHING, isFetching
  })

type SetTattooStylesAT = {
  type: typeof SET_STYLES,
  tattooStyles: Array<TattooStyleType>
}

const setTattooStylesAC = (tattooStyles: Array<TattooStyleType>): SetTattooStylesAT => ({
    type: SET_STYLES, tattooStyles
})

type SetActiveStyleAT = {
  type: typeof SET_ACTIVE_STYLE,
  style: TattooStyleType | null
}

export const setActiveStyleAC = (style: TattooStyleType | null): SetActiveStyleAT => ({
    type: SET_ACTIVE_STYLE, style
})

type SetGalleryAT = {
  type: typeof SET_GALLERY,
  gallery: Array<GalleryItemType>
}

const setGalleryAC = (gallery: Array<GalleryItemType>): SetGalleryAT => ({
    type: SET_GALLERY, gallery
})

type SetArchivedGalleryAT = {
  type: typeof SET_ARCHIVED_GALLERY,
  archivedGallery: Array<GalleryItemType>
}

const setArchivedGalleryAC = (archivedGallery: Array<GalleryItemType>): SetArchivedGalleryAT => ({
  type: SET_ARCHIVED_GALLERY, archivedGallery
})

type DeleteGalleryItemAT = {
  type: typeof DELETE_GALLERY_ITEM,
  itemId: string
}

const deleteGalleryItemAC = (itemId: string): DeleteGalleryItemAT => ({
  type: DELETE_GALLERY_ITEM, itemId
})

type DeleteArchivedGalleryItemAT = {
  type: typeof DELETE_ARCHIVED_GALLERY_ITEM
  itemId: string
}

const deleteArchivedGalleryItemAC = (itemId: string): DeleteArchivedGalleryItemAT => ({
  type: DELETE_ARCHIVED_GALLERY_ITEM, itemId
})


//thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getTattooStyles = (): ThunkType => async (
  dispatch
) => {
  try {
    dispatch(setIsFetchingAC(true))
    let response = await portfolioApi.getTattooStyles()
    dispatch(setTattooStylesAC(response.tattooStyles))
    dispatch(setIsFetchingAC(false))
  } catch (e) {
    dispatch(setIsFetchingAC(false))
    console.log(e)
  }
}

export const addTattooStyle = (values: FormData): ThunkType => async (
    dispatch
) => {
  try {
    let response = await portfolioApi.addTattooStyle(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setTattooStylesAC(response.tattooStyles))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e) {
    console.log(e)
  }
}

export const editTattooStyle = (id: string, values: FormData): ThunkType => async (dispatch) => {
  try {
    let response = await portfolioApi.editTattooStyle(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setTattooStylesAC(response.tattooStyles))
    }
  } catch (e) {
    console.log(e)
  }
}

export const deleteTattooStyle = (id: string): ThunkType => async (dispatch) => {
  try {
    let response = await portfolioApi.deleteTattooStyle(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setTattooStylesAC(response.tattooStyles))
      dispatch(setActiveStyleAC(response.tattooStyles[0]))
    }

  } catch (e) {
    console.log(e)
  }
}

export const getActualPortfolio = (
    style: TattooStyleType | null,
    currentPage: number,
    pageSize: number
): ThunkType => async (dispatch) => {
  //debugger
  try {
    dispatch(setIsFetchingAC(true))
    let responseStyles = await portfolioApi.getTattooStyles()
    let activeStyle
    if (responseStyles.resultCode === ResultCodesEnum.Success) {
      const styles = responseStyles.tattooStyles
      dispatch(setTattooStylesAC(styles))
      if (style?._id) {
        activeStyle = style
      } else {
        activeStyle = styles[0]
        dispatch(setActiveStyleAC(activeStyle))
      }
    }
    if (activeStyle) {
      let responseGallery = await portfolioApi.getGalleryItems(activeStyle.value, currentPage, pageSize)
      if (responseGallery.resultCode === ResultCodesEnum.Success) {
        dispatch(setGalleryAC(responseGallery.gallery))
        dispatch(setGalleryTotalCountAC(responseGallery.totalCount))
      }
      dispatch(setIsFetchingAC(false))
    }
  } catch (e) {
    dispatch(setIsFetchingAC(false))
    console.log(e)
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
      dispatch(setArchivedGalleryAC(response.gallery))
      dispatch(setArchivedGalleryTotalCountAC(response.totalCount))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(setIsFetchingAC(false))
  }
}

export const resetActiveStyle = (
  style: TattooStyleType
): ThunkType => async (dispatch) => {
  dispatch(setActiveStyleAC(style))
  dispatch(setCurrentGalleryPageAC(1))
}

export const adminUpdateGallery = (
  tattooStyle: string,
  values: any
): ThunkType => async (dispatch) => {

  try {
    dispatch(setIsFetchingAC(true))
    let response = await portfolioApi.adminUpdateGallery(tattooStyle, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setCurrentGalleryPageAC(0))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(setIsFetchingAC(false))
  }
}

export const deleteGalleryItem = (
  id: string
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await portfolioApi.deleteGalleryItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteGalleryItemAC(id))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const deleteArchivedGalleryItem = (
    id: string
): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await portfolioApi.deleteArchivedGalleryItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteArchivedGalleryItemAC(id))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const archiveGalleryItem = (id: string): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await portfolioApi.archiveGalleryItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setArchivedGalleryAC(response.gallery))
      dispatch(deleteGalleryItemAC(id))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}

export const reactivateArchivedGalleryItem = (id: string): ThunkType => async (dispatch) => {
  try {
    dispatch(toggleIsDeletingInProcessAC(true, id))
    let response = await portfolioApi.reactivateArchivedGalleryItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(deleteArchivedGalleryItemAC(id))
    }
  } catch (e) {
    console.log(e)
  } finally {
    dispatch(toggleIsDeletingInProcessAC(false, id))
  }
}
