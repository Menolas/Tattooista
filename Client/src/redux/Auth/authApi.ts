import $api from "../../http";
import {LoginFormValues, RegistrationFormValues, RoleType, CommonResponseFields, UserType} from "../../types/Types";
import {IUser} from "../../types/Types";

type LoginResponseType = CommonResponseFields & {
    userData: {
        user: IUser;
        accessToken: string;
        refreshToken: string;
        roles: Array<RoleType>;
    }
};

type RegistrationResponseType = CommonResponseFields & {
    userData: {
        user: IUser;
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
        user: IUser;
        accessToken: string;
        refreshToken: string;
        roles: Array<RoleType>;
    }
};

export const authAPI = {

  async registration(values: RegistrationFormValues) {
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

  async getUserProfile(
    token: string | null,
    userId: string
  ) {
    return await $api.get<UpdateUserResponseType>(
        `users/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    ).then(response => response.data);
  },
};
