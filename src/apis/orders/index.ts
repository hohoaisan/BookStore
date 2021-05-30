import axios, { AxiosRequestConfig } from 'axios';
import Axios from 'apis/instance';
export const getAll = ({
  filter,
  page,
  limit,
  search,
}: {
  filter?: string;
  page?: number;
  limit?: number;
  search?: null | string;
}) => {
  let config: AxiosRequestConfig = {
    method: 'get',
    url: `/api/Orders`,
    params: { filter, page, limit, search },
  };
  return Axios(config);
};
export const get = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'get',
    url: `/api/Orders/${id}`,
  };
  return Axios(config);
};


export const accept = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Orders/${id}`,
    data: { id, status: "a" },
  };
  return Axios(config);
};
export const reject = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Orders/${id}`,
    data: { id, status: "r" },
  };
  return Axios(config);
};

export const markPending = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Orders/${id}`,
    data: { id, status: "p" },
  };
  return Axios(config);
};

export const markCompleted = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Orders/${id}`,
    data: { id, status: "c" },
  };
  return Axios(config);
};

export const markError = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Orders/${id}`,
    data: { id, status: "e" },
  };
  return Axios(config);
};
