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
  remove,
} from 'apis/author';

import { setQueryState, setDataGridRow, setModalItemData, setDataGridSelectedRow, setOpenModal, setModalMode } from './dashboard';

export const FETCH_AUTHORS = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
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

export const FETCH_AUTHOR = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    get(authorId)
      .then((res) => {
        dispatch(setModalItemData(res.data));
      })
      .catch((err) => {
        // toast.error('Có lỗi xảy ra');
      });
};

export const CREATE_AUTHOR =
  ({ name, description }: { name: string; description: string }) =>
  async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
    // dispatch({ type: 'REQUEST_CREATE_NEW_AUTHOR' });
    create({ name, description })
      .then((res) => {
        toast.success('Đã thêm tác giả mới');
        dispatch(setOpenModal(false));
        dispatch(setModalMode('new'));
        dispatch(FETCH_AUTHORS());
        // dispatch({ type: 'SUCCESS_CREATE_NEW_AUTHOR' });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi thêm tác giả mới');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
  };

export const EDIT_AUTHOR =
  ({ id, name, description }: { id: string; name?: string; description?: string }) =>
  async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
    edit({ id, name, description })
      .then((res) => {
        toast.success('Đã sửa thông tin tác giả');
        dispatch(FETCH_AUTHORS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa tác giả này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
  };

export const DISABLE_AUTHOR = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    disable(authorId)
      .then((res) => {
        toast.success('Đã xoá (ẩn) tác giả, xem tác giả này ở tab ĐÃ XOÁ');
        dispatch(FETCH_AUTHORS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa tác giả này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};
export const ENABLE_AUTHOR = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    enable(authorId)
      .then((res) => {
        toast.success('Đã bỏ xoá tác giả, xem tác giả này ở tab mặc định');
        dispatch(FETCH_AUTHORS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa tác giả này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};

export const REMOVE_AUTHOR = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    remove(authorId)
      .then((res) => {
        toast.success('Đã xoá vĩnh viễn tác giả');
        dispatch(FETCH_AUTHORS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi thực hiện xoá');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};

