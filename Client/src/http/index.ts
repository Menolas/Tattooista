import axios, {CreateAxiosDefaults} from "axios";
import {IUser} from "../types/Types";

export const API_URL = process.env.API_URL;

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: IUser
}

export const instance = axios.create({
    withCredentials: true,
    baseURL: API_URL
} as CreateAxiosDefaults);

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
});

$api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {return Promise.reject(error)});

$api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.config && !error.config._isRetry) {
            originalRequest._isRetry = true;
            try {
                const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true});
                localStorage.setItem('token', response.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return $api.request(originalRequest);
            } catch (e) {
                console.log('Not authorized');
            }

        }
    return Promise.reject(error);
});

export default $api;
