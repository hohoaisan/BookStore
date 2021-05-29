import { Dispatch, AnyAction, ActionCreator } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

import store from 'stores/store';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import {
  getAll,
  get,
  create,
  edit,
  disable,
  enable,
  // remove ,
  setAdmin,
  removeAdmin,
} from 'apis/users';

import {
  setQueryState,
  setDataGridRow,
  setModalItemData,
  setDataGridSelectedRow,
  setOpenModal,
  setModalMode,
} from './dashboard';

export const FETCH_USERS = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
  const query = getState().dashboard.query;
  getAll(query)
    .then((res) => {
      try {
        const { rows, rowCount } = res.data;
        dispatch(setDataGridRow({ rows, rowCount }));
      } catch (err) {
        throw Promise.reject(err);
      }
    })
    .catch((err) => {
      toast.error('Có lỗi xảy ra');
    });
};

export const FETCH_USER = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
  const id = getState().dashboard.selectedRow.id;
  id &&
    get(id)
      .then((res) => {
        dispatch(setModalItemData(res.data));
      })
      .catch((err) => {
        // toast.error('Có lỗi xảy ra');
      });
};

export const CREATE_USER =
  (params: {
    username: string;
    fullname: string;
    gender: boolean;
    phone: string;
    email: string;
    dob: string;
    // ward: string;
    address: string;
    password: string;
  }) =>
  async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
    // dispatch({ type: 'REQUEST_CREATE_NEW_AUTHOR' });
    create(params)
      .then((res) => {
        toast.success('Đã thêm người dùng mới');
        dispatch(setOpenModal(false));
        dispatch(setModalMode('new'));
        dispatch(FETCH_USERS());
        // dispatch({ type: 'SUCCESS_CREATE_NEW_AUTHOR' });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi thêm người dùng mới');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
  };

export const EDIT_USER =
  (params: {
    id: string;
    username?: string;
    fullname?: string;
    gender?: string;
    phone?: string;
    email?: string;
    // ward?: string;
    dob?: string;
    address?: string;
    password?: string;
  }) =>
  async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
    edit(params)
      .then((res) => {
        toast.success('Đã sửa thông tin người dùng');
        dispatch(FETCH_USERS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa người dùng này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
  };

export const DISABLE_USER = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    disable(authorId)
      .then((res) => {
        toast.success('Đã xoá (ẩn) người dùng, xem người dùng này ở tab ĐÃ XOÁ');
        dispatch(FETCH_USERS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa người dùng này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};
export const ENABLE_USER = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    enable(authorId)
      .then((res) => {
        toast.success('Đã bỏ xoá người dùng, xem người dùng này ở tab mặc định');
        dispatch(FETCH_USERS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa người dùng này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};

// export const REMOVE_USER = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
//   const authorId = getState().dashboard.selectedRow.id;
//   authorId &&
//     remove(authorId)
//       .then((res) => {
//         toast.success('Đã xoá vĩnh viễn người dùng');
//         dispatch(FETCH_USERS());
//       })
//       .catch((err) => {
//         console.log(err);
//         toast.error('Có vấn đề khi thực hiện xoá');
//         // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
//       });
// };

export const SET_ADMIN = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    setAdmin(authorId)
      .then((res) => {
        toast.success('Đã cấp vai trò quản trị viên cho người dùng');
        dispatch(FETCH_USERS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề xảy ra khi cấp quyền');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};

export const REMOVE_ADMIN = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    removeAdmin(authorId)
      .then((res) => {
        toast.success('Đã xoá vai trò quản trị viên cho người dùng');
        dispatch(FETCH_USERS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề xảy ra khi xoá quyền');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};
