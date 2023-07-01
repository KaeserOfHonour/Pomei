import axios from "axios";
import { SignUpForm } from "../models/SignUp";
import { SignInForm } from "../models/SignIn";

const basicApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/`,
    withCredentials: true,
});

const authApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/`,
    withCredentials: true,
});

authApi.defaults.headers.common["Content-Type"] = "application/json";

export const refreshAccessTokenFn = async () => {
    const res = await authApi.get("auth/refresh_token");
    return res.data;
};

authApi.interceptors.response.use(
    (response) => response,
    async (err) => {
        const originalRequest = err.config;
        const errMessage = err.response.data.error as string;
        // eslint-disable-next-line no-underscore-dangle
        if (errMessage.includes("Unauthorized") && !originalRequest._retry) {
            // eslint-disable-next-line no-underscore-dangle
            originalRequest._retry = true;
            await refreshAccessTokenFn();
            return authApi(originalRequest);
        }
        return Promise.reject(err);
    }
);

export const signUp = async (data: SignUpForm) => {
    const res = await basicApi.post("auth/sign_up", data);
    return res.data;
};

export const signIn = async (data: SignInForm) => {
    const res = await authApi.post("auth/sign_in", data);
    return res.data;
};

export const signOut = async () => {
    const res = await authApi.get("auth/sign_out");
    return res.data;
};

export const terminateAllSessions = async () => {
    const res = await authApi.get("auth/terminate_all_sessions");
    return res.data;
};

export const fetchUser = async () => {
    const res = await authApi.get("auth/get_auth_user");
    return res.data;
};