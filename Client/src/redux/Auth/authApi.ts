import axios, {AxiosRequestConfig, CreateAxiosDefaults} from 'axios'
import { LoginFormValues } from '../../types/Types'
import { SERVER_URL } from '../../utils/constants'
//import {CreateAxiosDefaults} from 'axios/index'

const instance = axios.create({
  baseURL: SERVER_URL
} as CreateAxiosDefaults)

type LoginResponseType = {
    resultCode: number,
    user?: {
        password: string,
        roles: Array<string>,
        token: string,
        username: string,
        _id: string
    },
    error?: string | null
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

  login(values: LoginFormValues) {
      return instance.post<LoginResponseType>('auth/login',  values)
        .then(res => res.data)
  },

  logout(userId: string) {
    return instance.delete<number>(`auth/logout/${userId}`)
        .then(response => {
          return response.data
        })
  }
}
