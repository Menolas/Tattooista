import $api, {API_URL} from '../../http'
import axios, {AxiosRequestConfig, CreateAxiosDefaults} from 'axios'
import {LoginFormValues, RegistrationFormValues} from '../../types/Types'
import { SERVER_URL } from '../../utils/constants'
import {IUser} from "../../types/IUser";
//import {CreateAxiosDefaults} from 'axios/index'

const instance = axios.create({
  baseURL: SERVER_URL
} as CreateAxiosDefaults)

type LoginResponseType = {
    user: IUser,
    accessToken: string,
    refreshToken: string,
    error?: string
}

type RegistrationResponseType = {
    resultCode?: number
    message?: string
    user: {
        user: IUser
        accessToken: string
        refreshToken: string
    }
}

type LogoutResponseType = {
    deletedCount: number
    acknowledged: boolean
}

export const authAPI = {

  auth(token: string | null) {
    //debugger;
    return instance.get<number>('auth/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    } as AxiosRequestConfig)
    .then(response => {
      return response.data
    })
  },

  registration(email: string, password: string) {
      return $api.post<RegistrationResponseType>('auth/registration', {email, password})
          .then(res => res.data)

  },

  login(values: LoginFormValues) {
      return $api.post<LoginResponseType>('auth/login',  values)
        .then(res => res.data)
  },

  logout() {
    return $api.post<LogoutResponseType>(`auth/logout`)
        .then(response => response.data)
  },

  checkAuth() {
      return axios.get(`${API_URL}/auth/refresh`, {withCredentials: true})
          .then(response => response.data)
  }
}
