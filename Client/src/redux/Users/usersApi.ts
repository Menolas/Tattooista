import axios, {CreateAxiosDefaults} from "axios"
import { UserType } from "../../types/Types"
import {API_URL} from "../../http"
import {UsersFilterType} from "./users-reducer"

const instance = axios.create({
    baseURL: API_URL
} as CreateAxiosDefaults)

type GetUsersResponseType = {
    resultCode: number,
    users: Array<UserType>,
    totalCount: number
}

export const usersAPI = {

    getUsers(
        currentPage = 1,
        pageSize = 5,
        filter: UsersFilterType
    ) {
        return instance.get<GetUsersResponseType>(
            `users?&page=${currentPage}&limit=${pageSize}&term=${filter.term}&role=${filter.role}`, {
            withCredentials: true
        })
            .then(response => response.data)
    }
}
