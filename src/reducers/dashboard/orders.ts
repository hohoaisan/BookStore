import { Dispatch, AnyAction, ActionCreator } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

import store from 'stores/store';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { getAll, get, accept, reject, markCompleted, markError, markPending } from 'apis/orders';

import {
  setQueryState,
  setDataGridRow,
  setModalItemData,
  setDataGridSelectedRow,
  setOpenModal,
  setModalMode,
} from './dashboard';

export const FETCH_ORDERS = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
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

export const FETCH_ORDER = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
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

export const ACCEPT_ORDER = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const id = getState().dashboard.selectedRow.id;
  id &&
    accept(id)
      .then((res) => {
        toast.success('Đã chấp nhận đơn hàng, xem đơn hàng này ở tab CHỜ THANH TOÁN');
        dispatch(FETCH_ORDERS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa đơn hàng này');
      });
};

export const REJECT_ORDER = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const id = getState().dashboard.selectedRow.id;
  id &&
    reject(id)
      .then((res) => {
        toast.success('Đã từ chối đơn hàng, xem đơn hàng này ở tab TỪ CHỐI');
        dispatch(FETCH_ORDERS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa đơn hàng này');
      });
};

export const MARK_COMPLETED_ORDER = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const id = getState().dashboard.selectedRow.id;
  id &&
    markCompleted(id)
      .then((res) => {
        toast.success('Đã đánh dấu đơn hàng này là thành công, xem ở tab HOÀN THÀNH');
        dispatch(FETCH_ORDERS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa đơn hàng này');
      });
};

export const MARK_ERROR_ORDER = () => async (dispatch: Dispatch<any>, getState: typeof store.getState) => {
  const id = getState().dashboard.selectedRow.id;
  id &&
    markError(id)
      .then((res) => {
        toast.success('Đã đánh dấu đơn hàng này là lỗi, xem ở tab ĐƠN LỖI');
        dispatch(FETCH_ORDERS());
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi sửa đơn hàng này');
      });
};
