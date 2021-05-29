import { Dispatch, AnyAction, ActionCreator } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

import store from 'stores/store';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { getAll, get, create, edit, disable, enable, remove } from 'apis/books';

import {
  setQueryState,
  setDataGridRow,
  setModalItemData,
  setDataGridSelectedRow,
  setOpenModal,
  setModalMode,
} from './dashboard';

export const FETCH_BOOKS = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
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

export const FETCH_BOOK = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
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

export const CREATE_BOOK =
  (params: {
    name: string;
    description: string;
    imageurl?: string;
    pages: number;
    weight: number;
    publishDay: string;
    author: number;
    category: number;
    quantity: number;
    price: number;
    publisher: string;
    cover: string;
  }) =>
  async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
    // dispatch({ type: 'REQUEST_CREATE_NEW_AUTHOR' });
    create(params)
      .then((res) => {
        toast.success('Đã thêm sách mới');
        dispatch(setOpenModal(false));
        dispatch(setModalMode('new'));
        dispatch(FETCH_BOOKS());
        // dispatch({ type: 'SUCCESS_CREATE_NEW_AUTHOR' });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi thêm sách mới');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
  };

export const EDIT_BOOK =
  (params: {
    id: string;
    name: string;
    description: string;
    imageurl?: string;
    pages: number;
    weight: number;
    publishDay: string;
    author: number;
    category: number;
    quantity: number;
    price: number;
    publisher: string;
    cover: string;
  }) =>
  async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
    edit(params)
      .then((res) => {
        toast.success('Đã sửa thông tin sách');
        dispatch(FETCH_BOOKS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa sách này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
  };

export const DISABLE_BOOK = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    disable(authorId)
      .then((res) => {
        toast.success('Đã xoá (ẩn) sách, xem sách này ở tab ĐÃ XOÁ');
        dispatch(FETCH_BOOKS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa sách này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};
export const ENABLE_BOOK = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    enable(authorId)
      .then((res) => {
        toast.success('Đã bỏ xoá sách, xem sách này ở tab mặc định');
        dispatch(FETCH_BOOKS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa sách này');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};

export const REMOVE_BOOK = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const authorId = getState().dashboard.selectedRow.id;
  authorId &&
    remove(authorId)
      .then((res) => {
        toast.success('Đã xoá vĩnh viễn sách');
        dispatch(FETCH_BOOKS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi thực hiện xoá');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
};
