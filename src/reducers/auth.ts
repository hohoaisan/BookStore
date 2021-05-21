import { Dispatch } from 'redux';
import { createSlice } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  user: null,
  token: null,
};
export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout } = AuthSlice.actions;

export const login =
  ({ username, password }: { username: string; password: string }) =>
  async (dispatch: Dispatch) => {
    const apiBaseUrl = 'https://localhost:5001';

    let data = JSON.stringify({ username, password });

    let config: AxiosRequestConfig = {
      method: 'post',
      url: `${apiBaseUrl}/api/Auth/login`,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      data,
      timeout: 20000,
    };
    await axios(config)
      .then((res) => {
        dispatch(loginSuccess(res.data));
        toast.success('LOGIN SUCCESS');
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
        toast.error('LOGIN ERROR');
      });
  };

export default AuthSlice.reducer;
