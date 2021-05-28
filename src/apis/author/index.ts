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
    url: `/api/Authors`,
    params: { filter, page, limit, search },
  };
  return Axios(config);
};
export const get = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'get',
    url: `/api/Authors/${id}`,
  };
  return Axios(config);
};
export const create = ({ name, description }: { name: string; description: string }) => {
  let config: AxiosRequestConfig = {
    method: 'post',
    url: `/api/Authors`,
    data: { name, description },
  };
  return Axios(config);
};

export const edit = ({ id, name, description }: { id: string; name?: string; description?: string }) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Authors/${id}`,
    data: { id, name, description },
  };
  return Axios(config);
};

export const disable = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Authors/${id}`,
    data: { id, deleted: true },
  };
  return Axios(config);
};
export const enable = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Authors/${id}`,
    data: { id, deleted: false },
  };
  return Axios(config);
};
export const remove = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'delete',
    url: `/api/Authors/${id}`,
  };
  return Axios(config);
};

// export default getAuthors;
