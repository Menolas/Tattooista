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
        token: string | null,
        currentPage = 1,
        pageSize = 5,
        filter: SearchFilterType
    ) {
        return await $api.get<GetUsersResponseType>(
            `users?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&role=${filter.condition}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
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

    async deleteUser(
        token: string | null,
        userId: string
    ) {
        return await $api.delete<DeleteUserResponseType>(
            `users/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    },

    async updateUser(
        token: string | null,
        userId: string,
        values: FormData
    ) {
        return await $api.post<UpdateUserResponseType>(
            `users/edit/${userId}`,
            values,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    },

    async addUser(
        token: string | null,
        values: FormData
    ) {
        return await $api.post<AddUserResponseType>(
            'users',
            values,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(response => response.data);
    },
};
