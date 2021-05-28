import { Dispatch, AnyAction, ActionCreator } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

import store from 'stores/store';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { getAll, get, create, edit, disable, enable, remove } from 'apis/categories/index';

import {
  setQueryState,
  setDataGridRow,
  setModalItemData,
  setDataGridSelectedRow,
  setOpenModal,
  setModalMode,
} from './dashboard';

export const FETCH_CATEGORIES = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
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

export const FETCH_CATEGORY = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
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

export const CREATE_CATEGORY =
  ({ name }: { name: string }) =>
  async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
    // dispatch({ type: 'REQUEST_CREATE_NEW_AUTHOR' });
    create({ name })
      .then((res) => {
        toast.success('Đã thêm danh mục mới');
        dispatch(setOpenModal(false));
        dispatch(setModalMode('new'));
        dispatch(FETCH_CATEGORIES());
        // dispatch({ type: 'SUCCESS_CREATE_NEW_AUTHOR' });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi thêm danh mục mới');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
  };

export const EDIT_CATEGORY =
  ({ id, name, description }: { id: string; name?: string; description?: string }) =>
  async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
    edit({ id, name })
      .then((res) => {
        toast.success('Đã sửa thông tin danh mục');
        dispatch(FETCH_CATEGORIES());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa danh mục này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
  };

export const DISABLE_CATEGORY = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    disable(authorId)
      .then((res) => {
        toast.success('Đã xoá (ẩn) danh mục, xem danh mục này ở tab ĐÃ XOÁ');
        dispatch(FETCH_CATEGORIES());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa danh mục này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};
export const ENABLE_CATEGORY = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    enable(authorId)
      .then((res) => {
        toast.success('Đã bỏ xoá danh mục, xem danh mục này ở tab mặc định');
        dispatch(FETCH_CATEGORIES());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa danh mục này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};

export const REMOVE_CATEGORY = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    remove(authorId)
      .then((res) => {
        toast.success('Đã xoá vĩnh viễn danh mục');
        dispatch(FETCH_CATEGORIES());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi thực hiện xoá');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};
