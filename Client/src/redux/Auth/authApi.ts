import $api from "../../http";
import {LoginFormValues, RegistrationFormValues, RoleType, CommonResponseFields, UserType} from "../../types/Types";

type LoginResponseType = CommonResponseFields & {
    userData: {
        user: UserType;
        accessToken: string;
        refreshToken: string;
        roles: Array<RoleType>;
    }
};

type RegistrationResponseType = CommonResponseFields & {
    userData: {
        user: UserType;
        accessToken: string;
        refreshToken: string;
        roles: Array<RoleType>;
    }
};

type LogoutResponseType = CommonResponseFields;

type UpdateUserResponseType = CommonResponseFields & {
    user: UserType;
}

type CheckAuthResponseType = CommonResponseFields & {
    userData: {
        isAuth?: boolean;
        user: UserType;
        accessToken: string;
        refreshToken: string;
        roles: Array<RoleType>;
    }
};

export const authAPI = {

  async registration(values: FormData) {
      return await $api.post<RegistrationResponseType>('auth/registration', values)
          .then(res => res.data);
  },

  async login(values: LoginFormValues) {
      return await $api.post<LoginResponseType>('auth/login',  values)
        .then(response => response.data);
  },

  async logout() {
    return await $api.post<LogoutResponseType>(`auth/logout`)
        .then(response => response.data);
  },

  async checkAuth() {
      return await $api.get<CheckAuthResponseType>(`auth/refresh`)
          .then(response => response.data);
  },

  async verifyEmail(token: string | null) {
    return await $api.post<LoginResponseType>(
        `auth/verify-email`,
        { token }
    ).then(response => response.data);
  },
};
