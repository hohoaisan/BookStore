import axios, { AxiosRequestConfig } from 'axios';
import Axios from 'apis/instance';
const login = ({ username, password }: { username: string; password: string }) => {
  let data = JSON.stringify({ username, password });
  let config: AxiosRequestConfig = {
    method: 'post',
    url: `/api/Auth/login`,
    data,
  };
  return Axios(config);
};


export default login