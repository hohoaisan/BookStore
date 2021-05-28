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
    url: `/api/Categories`,
    params: { filter, page, limit, search },
  };
  return Axios(config);
};
export const get = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'get',
    url: `/api/Categories/${id}`,
  };
  return Axios(config);
};
export const create = ({ name }: { name: string }) => {
  let config: AxiosRequestConfig = {
    method: 'post',
    url: `/api/Categories`,
    data: { name },
  };
  return Axios(config);
};

export const edit = ({ id, name }: { id: string; name?: string }) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Categories/${id}`,
    data: { id, name },
  };
  return Axios(config);
};

export const disable = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Categories/${id}`,
    data: { id, deleted: true },
  };
  return Axios(config);
};
export const enable = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Categories/${id}`,
    data: { id, deleted: false },
  };
  return Axios(config);
};
export const remove = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'delete',
    url: `/api/Categories/${id}`,
  };
  return Axios(config);
};

// export default getAll;
