import axios from 'axios';
import qs from 'qs';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// This will store our access token in memory
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

const filterEmptyValues = (obj: Record<string, any>) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const isArrayAndEmpty = Array.isArray(value) && value.length === 0;
        if (value !== undefined && value !== null && value !== '' && !isArrayAndEmpty) {
            acc[key] = value;
        }
        return acc;
    }, {} as Record<string, any>);
};

const baseApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Crucial for sending/receiving the refresh token cookie
    paramsSerializer: (params) => {
        const cleanParams = filterEmptyValues(params);
        return qs.stringify(cleanParams, { arrayFormat: 'brackets' });
    }
});

// Request Interceptor: Attach Access Token
baseApi.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and Refresh Token
baseApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call the refresh endpoint
                // Note: We use a separate axios call or avoid interceptors on this one to prevent loops
                const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
                const { accessToken: newToken } = response.data;

                setAccessToken(newToken);

                // Update original request header and retry
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return baseApi(originalRequest);
            } catch (refreshError) {
                // Refresh token expired or invalid - logout user
                setAccessToken(null);
                // Redirect to login or dispatch logout event
                window.dispatchEvent(new Event('auth-logout'));
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default baseApi;
