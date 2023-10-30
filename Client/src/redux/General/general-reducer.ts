import { generalSourcesApi } from './generalSourcesApi'
import {BookConsultationFormValues, FaqType, PageType, ServiceType} from '../../types/Types'
import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {ResultCodesEnum} from '../../utils/constants'

const SET_FAQ_ITEMS = 'SET_FAQ_ITEMS'
const SET_SERVICES = 'SET_SERVICES'
const SET_PAGES = 'SET_PAGES'
const SET_PAGE_VISIBILITY = 'SET_PAGE_VISIBILITY'
const SET_IS_SUCCESS = 'SET_IS_SUCCESS'
const SET_IS_SUCCESS_BOOKING = 'SET_IS_SUCCESS_BOOKING'
const SET_BOOKING_CONSULTATION_API_ERROR = 'SET_BOOKING_CONSULTATION_API_ERROR'
const SET_UPDATE_FAQ_ITEM_API_ERROR = 'SET_UPDATE_FAQ_ITEM_API_ERROR'
const SET_UPDATE_SERVICE_API_ERROR = 'SET_UPDATE_SERVICE_API_ERROR'
const SET_IS_BOOKING_MODAL_OPEN = 'SET_IS_BOOKING_MODAL_OPEN'

let initialState = {
  faq: [] as Array<FaqType>,
  services: [] as Array<ServiceType>,
  pages: [] as Array<PageType>,
  isSuccess: false as boolean,
  isSuccessBooking: false as boolean,
  bookingConsultationApiError: '' as string | undefined,
  updateFaqItemApiError: '' as string | undefined,
  updateServiceApiError: '' as string | undefined,
  isBookingModalOpen: false as boolean,
}

export type InitialStateType = typeof initialState

export const generalReducer = (
    state = initialState,
    action: ActionsTypes
): InitialStateType => {
  //debugger

  switch (action.type) {

    case SET_FAQ_ITEMS:
      return {
        ...state,
        faq: action.faqItems
      }
    case SET_SERVICES:
      return {
        ...state,
        services: action.services
      }

    case SET_PAGES:
      return {
        ...state,
        pages: action.pages
      }

    case SET_PAGE_VISIBILITY:
      return {
        ...state,
        pages: state.pages.map(page => {
          if (page._id === action.pageId) {
            return { ...page, isActive: action.isActive}
          }
          return page
        })
      }

    case SET_IS_SUCCESS:
      return {
        ...state,
        isSuccess: action.bol
      }

    case SET_IS_SUCCESS_BOOKING:
      return {
        ...state,
        isSuccessBooking: action.bol
      }

    case SET_BOOKING_CONSULTATION_API_ERROR:
      return {
        ...state,
        bookingConsultationApiError: action.error
      }

    case SET_UPDATE_FAQ_ITEM_API_ERROR:
      return {
        ...state,
        updateFaqItemApiError: action.error
      }

    case SET_UPDATE_SERVICE_API_ERROR:
      return {
        ...state,
        updateFaqItemApiError: action.error
      }

    case SET_IS_BOOKING_MODAL_OPEN:
      return {
        ...state,
        isBookingModalOpen: action.bol
      }

    default: return {
      ...state
    }
  }
}

type ActionsTypes = SetUpdateServiceApiErrorAT | SetUpdateFaqItemApiErrorAT | SetIsBookingModalOpenAT |
    SetBookingConsultationApiErrorAT | SetIsSuccessBookingAT | SetIsSuccessAT | SetPageVisibilityActionType
    | SetPagesActionType | SetFaqItemsActionType | SetServicesActionType

// action creators

type SetIsBookingModalOpenAT = {
  type: typeof SET_IS_BOOKING_MODAL_OPEN
  bol: boolean
}

export const setIsBookingModalOpenAC = (bol: boolean): SetIsBookingModalOpenAT => ({
  type: SET_IS_BOOKING_MODAL_OPEN, bol
})

type SetUpdateServiceApiErrorAT = {
  type: typeof SET_UPDATE_SERVICE_API_ERROR
  error: string | undefined
}

export const setUpdateServiceApiErrorAC = (error: string | undefined): SetUpdateServiceApiErrorAT => ({
  type: SET_UPDATE_SERVICE_API_ERROR, error
})

type SetUpdateFaqItemApiErrorAT = {
  type: typeof SET_UPDATE_FAQ_ITEM_API_ERROR
  error: string | undefined
}

export const setUpdateFaqItemApiErrorAC = (error: string | undefined): SetUpdateFaqItemApiErrorAT => ({
  type: SET_UPDATE_FAQ_ITEM_API_ERROR, error
})

type SetBookingConsultationApiErrorAT = {
  type: typeof  SET_BOOKING_CONSULTATION_API_ERROR
  error: string | undefined
}

export const setBookingConsultationApiErrorAC = (error: string | undefined): SetBookingConsultationApiErrorAT  => ({
  type: SET_BOOKING_CONSULTATION_API_ERROR, error
})

type SetIsSuccessBookingAT = {
  type: typeof SET_IS_SUCCESS_BOOKING
  bol: boolean
}

export const setIsSuccessBookingAC = (bol: boolean): SetIsSuccessBookingAT => ({
  type: SET_IS_SUCCESS_BOOKING, bol
})

type SetIsSuccessAT = {
  type: typeof SET_IS_SUCCESS
  bol: boolean
}

export const setIsSuccessAC = (bol: boolean): SetIsSuccessAT => ({
  type: SET_IS_SUCCESS, bol
})

type SetPageVisibilityActionType = {
  type: typeof SET_PAGE_VISIBILITY
  pageId: string
  isActive: boolean
}

const setPageVisibility = (pageId: string, isActive: boolean): SetPageVisibilityActionType => ({
  type: SET_PAGE_VISIBILITY, pageId, isActive
})

type SetPagesActionType = {
  type: typeof SET_PAGES,
  pages: Array<PageType>
}

const setPages = (pages: Array<PageType>): SetPagesActionType => (
    {
      type: SET_PAGES, pages
    }
)

type SetFaqItemsActionType = {
  type: typeof SET_FAQ_ITEMS,
  faqItems: Array<FaqType>
}

const setFaqItems = (faqItems: Array<FaqType>): SetFaqItemsActionType => (
  {
    type: SET_FAQ_ITEMS, faqItems
  }
)

type SetServicesActionType = {
  type: typeof SET_SERVICES,
  services: Array<ServiceType>
}

const setServices = (services: Array<ServiceType>): SetServicesActionType => (
  {
    type: SET_SERVICES, services
  }
)

// thunks

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getFaqItems = (): ThunkType => async (
    dispatch
) => {
  try {
    let response = await generalSourcesApi.getFaqItems()
    dispatch(setFaqItems(response))
  } catch (e) {
    console.log(e)
  }
}

export const addFaqItem = (values: FaqType): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.addFaqItem(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e: any) {
    dispatch(setUpdateFaqItemApiErrorAC(e.response?.data?.message || 'An error occurred'))
    console.log(e)
  }
}

export const updateFaqItem = (id: string, values: any): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.updateFaqItem(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems))
    }
  } catch (e: any) {
    dispatch(setUpdateFaqItemApiErrorAC(e.response?.data?.message || 'An error occurred'))
    console.log(e)
  }
}

export const deleteFaqItem = (id: string): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.deleteFaqItem(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setFaqItems(response.faqItems))
    }
  } catch (e) {
    console.log(e)
  }
}

export const getServices = (): ThunkType => async (dispatch) => {
  try {
    let response = await generalSourcesApi.getServices()
    dispatch(setServices(response));
  } catch (e) {
    console.log(e);
  }
}

export const getPages = (): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.getPages()
    dispatch(setPages(response.pages))
  } catch (e) {
    console.log(e);
  }
}

export const editAboutPage = (id: string, FormData: FormData): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.editAboutPage(id, FormData)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setPages(response.pages))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e) {
    console.log(e);
  }
}

export const changePageVisibility = (
    pageId: string,
    isActive: boolean
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.changePageVisibility(pageId, isActive)
    dispatch(setPageVisibility(pageId, !isActive))
  } catch (e) {
    console.log(e)
  }
}

export const editService = (
    id: string,
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.editService(id, values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServices(response.services))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e: any) {
    dispatch(setUpdateServiceApiErrorAC(e.response?.data?.message || 'An error occurred'))
    console.log(e)
  }
}

export const addService = (
    values: FormData
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.addService(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServices(response.services))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e: any) {
    dispatch(setUpdateServiceApiErrorAC(e.response?.data?.message || 'An error occurred'))
    console.log(e)
  }
}

export const deleteService = (
    id: string
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.deleteService(id)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setServices(response.services))
    }
  } catch (e) {
    console.log(e)
  }
}

export const bookConsultation = (
    values: BookConsultationFormValues
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.bookConsultation(values)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setBookingConsultationApiErrorAC(''))
      dispatch(setIsBookingModalOpenAC(false))
      dispatch(setIsSuccessBookingAC(true))
      console.log(response.message)
    }
  } catch (e: any) {
    dispatch(setBookingConsultationApiErrorAC(e.response?.data?.message || 'An error occurred'))
    console.log(e)
  }
}

