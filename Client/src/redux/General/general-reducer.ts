import { generalSourcesApi } from './generalSourcesApi'
import {BookConsultationFormValues, FaqType, PageType, ServiceType} from '../../types/Types'
import {ThunkAction} from 'redux-thunk'
import {AppStateType} from '../redux-store'
import {ResultCodesEnum} from '../../utils/constants'

const SET_FAQ_ITEMS = 'SET_FAQ_ITEMS'
const SET_SERVICES = 'SET_SERVICES'
const SET_ABOUT_PAGE = 'SET_ABOUT_PAGE'
const SET_ABOUT_PAGE_VISIBILITY = 'SET_PAGE_VISIBILITY'
const SET_IS_SUCCESS = 'SET_IS_SUCCESS'
const SET_IS_SUCCESS_BOOKING = 'SET_IS_SUCCESS_BOOKING'
const SET_BOOKING_CONSULTATION_API_ERROR = 'SET_BOOKING_CONSULTATION_API_ERROR'
const SET_UPDATE_FAQ_ITEM_API_ERROR = 'SET_UPDATE_FAQ_ITEM_API_ERROR'
const SET_UPDATE_SERVICE_API_ERROR = 'SET_UPDATE_SERVICE_API_ERROR'
const SET_UPDATE_PAGE_API_ERROR = 'SET_UPDATE_PAGE_API_ERROR'
const SET_IS_BOOKING_MODAL_OPEN = 'SET_IS_BOOKING_MODAL_OPEN'

let initialState = {
  faq: [] as Array<FaqType>,
  services: [] as Array<ServiceType>,
  pageAbout: {} as PageType,
  isSuccess: false as boolean,
  isSuccessBooking: false as boolean,
  bookingConsultationApiError: '' as string | undefined,
  updateFaqItemApiError: '' as string | undefined,
  updateServiceApiError: '' as string | undefined,
  updatePageApiError: '' as string | undefined,
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

    case SET_ABOUT_PAGE:
      return {
        ...state,
        pageAbout: action.page
      }

    case SET_ABOUT_PAGE_VISIBILITY:
      return {
        ...state,
        pageAbout: { ...state.pageAbout, isActive: action.bol}
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

    case SET_UPDATE_PAGE_API_ERROR:
      return {
        ...state,
        updatePageApiError: action.error
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

type ActionsTypes = SetUpdatePageApiErrorAT | SetUpdateServiceApiErrorAT | SetUpdateFaqItemApiErrorAT | SetIsBookingModalOpenAT |
    SetBookingConsultationApiErrorAT | SetIsSuccessBookingAT | SetIsSuccessAT | SetAboutPageVisibilityAT
    | SetAboutPageAT | SetFaqItemsAT | SetServicesAT

// action creators

type SetIsBookingModalOpenAT = {
  type: typeof SET_IS_BOOKING_MODAL_OPEN
  bol: boolean
}

export const setIsBookingModalOpenAC = (bol: boolean): SetIsBookingModalOpenAT => ({
  type: SET_IS_BOOKING_MODAL_OPEN, bol
})

type SetUpdatePageApiErrorAT = {
  type: typeof SET_UPDATE_PAGE_API_ERROR
  error: string | undefined
}

export const setUpdatePageApiErrorAC = (error: string | undefined): SetUpdatePageApiErrorAT => ({
  type: SET_UPDATE_PAGE_API_ERROR, error
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

type SetAboutPageVisibilityAT = {
  type: typeof SET_ABOUT_PAGE_VISIBILITY
  bol: boolean
}

const seAboutPageVisibilityAC = (bol: boolean): SetAboutPageVisibilityAT => ({
  type: SET_ABOUT_PAGE_VISIBILITY, bol
})

type SetAboutPageAT = {
  type: typeof SET_ABOUT_PAGE,
  page: PageType
}

const setAboutPageAC = (page: PageType): SetAboutPageAT => ({
      type: SET_ABOUT_PAGE, page
})

type SetFaqItemsAT = {
  type: typeof SET_FAQ_ITEMS,
  faqItems: Array<FaqType>
}

const setFaqItems = (faqItems: Array<FaqType>): SetFaqItemsAT => (
  {
    type: SET_FAQ_ITEMS, faqItems
  }
)

type SetServicesAT = {
  type: typeof SET_SERVICES,
  services: Array<ServiceType>
}

const setServices = (services: Array<ServiceType>): SetServicesAT => (
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
      dispatch(setIsSuccessAC(true))
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

export const getAboutPage = (): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.getAboutPage()
    dispatch(setAboutPageAC(response.page))
    console.log(response.page)
  } catch (e) {
    console.log(e);
  }
}

export const editAboutPage = (FormData: FormData): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.editAboutPage(FormData)
    if (response.resultCode === ResultCodesEnum.Success) {
      dispatch(setAboutPageAC(response.page))
      dispatch(setIsSuccessAC(true))
    }
  } catch (e: any) {
    dispatch(setUpdatePageApiErrorAC(e.response?.data?.message || 'An error occurred'))
    console.log(e);
  }
}

export const changeAboutPageVisibility = (
    isActive: boolean
): ThunkType => async (dispatch) => {
  try {
    const response = await generalSourcesApi.changeAboutPageVisibility(isActive)
    dispatch(seAboutPageVisibilityAC(!isActive))
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

