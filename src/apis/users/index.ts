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
    url: `/api/Users`,
    params: { filter, page, limit, search },
  };
  return Axios(config);
};
export const get = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'get',
    url: `/api/Users/${id}`,
  };
  return Axios(config);
};
export const create = ({
  username,
  fullname,
  gender,
  phone,
  email,
  dob,
  // ward,
  address,
  password,
}: {
  username: string;
  fullname: string;
  gender: boolean;
  phone?: string;
  email?: string;
  dob?: string;
  // ward: string;
  address?: string;
  password: string;
}) => {
  let config: AxiosRequestConfig = {
    method: 'post',
    url: `/api/Users`,
    data: {
      username,
      fullname,
      gender,
      phone,
      email,
      dob,
      // ward,
      address,
      password,
    },
  };
  return Axios(config);
};

export const edit = ({
  id,
  username,
  fullname,
  gender,
  phone,
  email,
  dob,
  // ward,
  address,
  password,
}: {
  id: string;
  username?: string;
  fullname?: string;
  gender?: string;
  phone?: string;
  email?: string;
  dob?: string;
  // ward?: string;
  address?: string;
  password?: string;
}) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Users/${id}`,
    data: {
      id,
      username,
      fullname,
      gender,
      phone,
      email,
      dob,
      // ward,
      address,
      password,
    },
  };
  return Axios(config);
};

export const disable = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Users/${id}`,
    data: { id, disable: true },
  };
  return Axios(config);
};
export const enable = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Users/${id}`,
    data: { id, disable: false },
  };
  return Axios(config);
};
// export const remove = (id: string) => {
//   let config: AxiosRequestConfig = {
//     method: 'delete',
//     url: `/api/Users/${id}`,
//   };
//   return Axios(config);
// };

export const setAdmin = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Users/${id}`,
    data: { id, admin: true },
  };
  return Axios(config);
};

export const removeAdmin = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Users/${id}`,
    data: { id, admin: false },
  };
  return Axios(config);
};
// export default getUsers;
