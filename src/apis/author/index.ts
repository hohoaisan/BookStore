import axios, { AxiosRequestConfig } from 'axios';
import Axios from 'apis/instance';
export const getAuthors = ({
  filter,
  page,
  limit,
  search,
}: {
  filter?: 'default' | 'deleted';
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
export const getAuthor = (id: string) => {
  let config: AxiosRequestConfig = {
    method: 'get',
    url: `/api/Authors/${id}`,
  };
  return Axios(config);
};
export const createAuthor = ({ name, description }: { name: string; description: string }) => {
  let config: AxiosRequestConfig = {
    method: 'post',
    url: `/api/Authors`,
    data: { name, description },
  };
  return Axios(config);
};

// export default getAuthors;
