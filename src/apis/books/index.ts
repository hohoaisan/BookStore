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
    url: `/api/Books`,
    params: { filter, page, limit, search },
  };
  return Axios(config);
};
export const get = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'get',
    url: `/api/Books/${id}`,
  };
  return Axios(config);
};
export const create = ({
  name,
  description,
  imageUrl,
  pages,
  weight,
  publishDay,
  author,
  category,
  quantity,
  price,
  publisher,
  cover,
}: {
  name: string;
  description: string;
  imageUrl?: string;
  pages: number;
  weight: number;
  publishDay: string;
  author: number;
  category: number;
  quantity: number;
  price: number;
  publisher: string;
  cover: string;
}) => {
  let config: AxiosRequestConfig = {
    method: 'post',
    url: `/api/Books`,
    data: {
      name,
      description,
      imageUrl,
      pages,
      weight,
      publishDay,
      author,
      category,
      quantity,
      price,
      publisher,
      cover,
    },
  };
  return Axios(config);
};

export const edit = ({
  id,
  name,
  description,
  imageUrl,
  pages,
  weight,
  publishDay,
  author,
  category,
  quantity,
  price,
  publisher,
  cover,
}: {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  pages: number;
  weight: number;
  publishDay: string;
  author: number;
  category: number;
  quantity: number;
  price: number;
  publisher: string;
  cover: string;
}) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Books/${id}`,
    data: {
      id,
      name,
      description,
      imageUrl,
      pages,
      weight,
      publishDay,
      author,
      category,
      quantity,
      price,
      publisher,
      cover,
    },
  };
  return Axios(config);
};

export const disable = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Books/${id}`,
    data: { id, deleted: true },
  };
  return Axios(config);
};
export const enable = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'put',
    url: `/api/Books/${id}`,
    data: { id, deleted: false },
  };
  return Axios(config);
};
export const remove = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'delete',
    url: `/api/Books/${id}`,
  };
  return Axios(config);
};

export const uploadCover = (data: FormData) => {
  let config: AxiosRequestConfig = {
    method: 'post',
    url: `/api/Upload/BookImage`,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data,
  };
  return Axios(config);
};
// export default getBooks;
