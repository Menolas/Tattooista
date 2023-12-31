import $api, {API_URL} from "../../http"
import axios, {AxiosRequestConfig, CreateAxiosDefaults} from "axios"
import {LoginFormValues, RegistrationFormValues} from "../../types/Types"
import {IUser} from "../../types/Types"

const instance = axios.create({
  baseURL: API_URL
} as CreateAxiosDefaults)

type CommonResponseFields = {
    resultCode: number
    message?: string
}

type LoginResponseType = {
    resultCode?: number
    userData: {
        user: IUser
        accessToken: string
        refreshToken: string
    }
    error?: string
}

type RegistrationResponseType = CommonResponseFields & {
    userData: {
        user: IUser
        accessToken: string
        refreshToken: string
    }
}

type LogoutResponseType = CommonResponseFields

type CheckAuthResponseType = CommonResponseFields & {
    userData: {
        isAuth?: boolean
        user: IUser
        accessToken: string
        refreshToken: string
    }
}

export const authAPI = {

  // auth(token: string | null) {
  //   //debugger;
  //   return instance.get<number>('auth/', {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   } as AxiosRequestConfig)
  //   .then(response => {
  //     return response.data
  //   })
  // },

  registration(values: RegistrationFormValues) {
      return $api.post<RegistrationResponseType>('auth/registration', values)
          .then(res => res.data)

  },

  login(values: LoginFormValues) {
      return $api.post<LoginResponseType>('auth/login',  values)
        .then(response => response.data)
  },

  logout() {
    return $api.post<LogoutResponseType>(`auth/logout`)
        .then(response => response.data)
  },

  checkAuth() {
      return $api.get<CheckAuthResponseType>(`${API_URL}/auth/refresh`, {withCredentials: true})
          .then(response => response.data)
  }
}
