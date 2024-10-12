import {AxiosRequestConfig} from "axios";
import {RoleType, SearchFilterType, UserType, CommonResponseFields} from "../../types/Types";
import $api from "../../http";

type DeleteUserResponseType = CommonResponseFields;

type GetUsersResponseType = CommonResponseFields & {
    users: Array<UserType>;
    totalCount: number;
}

type GetRolesResponseType = CommonResponseFields & {
    roles: Array<RoleType>;
}

type UpdateUserResponseType = CommonResponseFields & {
    user: UserType;
}

type AddUserResponseType = UpdateUserResponseType;

export const usersAPI = {

    async getRoles() {
        return await $api.get<GetRolesResponseType>('users/roles')
            .then(response => response.data);
    },

    async getUsers(
        token: string,
        currentPage = 1,
        pageSize = 5,
        filter: SearchFilterType
    ) {
        return await $api.get<GetUsersResponseType>(
            `users?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&role=${filter.condition}`,
            { headers: { Authorization: `Bearer ${token}` } } as AxiosRequestConfig)
                .then(response => response.data);
    },

    async deleteUser(userId: string) {
        return await $api.delete<DeleteUserResponseType>(`users/${userId}`)
            .then(response => response.data);
    },

    async updateUser(
        userId: string,
        values: FormData
    ) {
        return await $api.post<UpdateUserResponseType>(`users/edit/${userId}`, values)
            .then(response => response.data);
    },

    async addUser(values: FormData) {
        return await $api.post<AddUserResponseType>('users', values)
            .then(response => response.data);
    },
};
