import { Dispatch } from 'redux';
import { createSlice } from '@reduxjs/toolkit';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import Axios from 'apis/instance';
import Login from 'apis/login';

const initialState: {
  user: object | null;
  token: string | null;
} = {
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
    loginFailed: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, logout, loginFailed } = AuthSlice.actions;

export const login =
  ({ username, password }: { username: string; password: string }) =>
  async (dispatch: Dispatch) => {
    Login({ username, password })
      .then((res) => {
        dispatch(loginSuccess(res.data));
        toast.success('LOGIN SUCCESS');
      })
      .catch((err) => {
        dispatch(loginFailed());
        toast.error('LOGIN FAILED');
      });
  };

export default AuthSlice.reducer;
