import axios, { AxiosRequestConfig, ResponseType, AxiosError } from 'axios';
import { logout } from 'reducers/auth';
import Store, { RootState } from 'stores/store';
import { toast } from 'react-toastify';
const baseURL = 'https://localhost:44326';

export const config: AxiosRequestConfig = {
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

const Axios = axios.create({
  ...config,
});
// Axios.interceptors

export const initAxiosInterceptors = (store: typeof Store) => {
  Axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      let token = store.getState().auth.token;
      config.headers.Authorization = token ? `Bearer ${token}` : '';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  Axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      const isTokenExpired = error.response?.headers['token-expired'] === 'true';
      if (isTokenExpired) {
        toast.error('Token expired');
        store.dispatch(logout());
      }
      return Promise.reject(error);
    },
  );
};

export default Axios;
