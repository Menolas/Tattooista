import $api, {API_URL} from "../../http"
import {LoginFormValues, RegistrationFormValues, RoleType} from "../../types/Types"
import {IUser} from "../../types/Types"

type CommonResponseFields = {
    resultCode: number
    message?: string
}

type LoginResponseType = CommonResponseFields & {
    userData: {
        user: IUser
        accessToken: string
        refreshToken: string
        roles: Array<RoleType>
    }
}

type RegistrationResponseType = CommonResponseFields & {
    userData: {
        user: IUser
        accessToken: string
        refreshToken: string
        roles: Array<RoleType>
    }
}

type LogoutResponseType = CommonResponseFields

type CheckAuthResponseType = CommonResponseFields & {
    userData: {
        isAuth?: boolean
        user: IUser
        accessToken: string
        refreshToken: string
        roles: Array<RoleType>
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
      return $api.get<CheckAuthResponseType>(`${API_URL}/auth/refresh`)
          .then(response => response.data)
  }
}
