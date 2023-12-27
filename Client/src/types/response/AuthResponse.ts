import {IUser} from "../Types";

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: IUser
}
