import { Dispatch, AnyAction, ActionCreator } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

import store from 'stores/store';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import {
  getAuthors,
  getAuthor,
  createAuthor,
  editAuthor,
  disableAuthor,
  enableAuthor,
  deleteAuthor,
} from 'apis/author';

interface queryType {
  filter: 'default' | 'deleted';
  page: number;
  limit: number;
  search: string | undefined;
}
const initialState: {
  query: queryType;
  rowCount: number;
  rows: any[];
  selectedRow: any | null;
  openModal: boolean;
  modalMode: 'new' | 'edit' | 'view';
  modalData: any | undefined;
} = {
  query: {
    filter: 'default',
    page: 1,
    limit: 10,
    search: undefined,
  },
  rowCount: 10,
  rows: [],
  selectedRow: null,
  openModal: false,
  modalMode: 'new',
  modalData: undefined,
};
export const AuthorSlice = createSlice({
  name: 'dashboard/authors',
  initialState: initialState,
  reducers: {
    setQueryState: (state, action) => {
      const { filter, page, limit, search } = action.payload;
      state.query = { filter, page: Number.parseInt(page), limit: Number.parseInt(limit), search };
    },
    setDataGridRow: (state, action) => {
      const { rowCount, rows } = action.payload;
      state.rowCount = Number.parseInt(rowCount);
      state.rows = rows;
      if (state.query.limit * state.query.page > state.rowCount) {
        state.query.page = Math.ceil(state.rowCount / state.query.limit) || 1;
      }
    },
    setModalItemData: (state, action) => {
      state.modalData = action.payload;
    },
    setDataGridSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
    setOpenModal: (state, action) => {
      state.openModal = action.payload;
    },
    setModalMode: (state, action) => {
      state.modalMode = action.payload;
    },
  },
});

export const { setQueryState, setDataGridRow, setModalItemData, setDataGridSelectedRow, setOpenModal, setModalMode } =
  AuthorSlice.actions;

export const FETCH_AUTHORS = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
  const query = getState().dashboardAuthor.query;
  getAuthors(query)
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
  const authorId = getState().dashboardAuthor.selectedRow.id;
  authorId &&
    getAuthor(authorId)
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
    createAuthor({ name, description })
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
    editAuthor({ id, name, description })
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
  const authorId = getState().dashboardAuthor.selectedRow.id;
  authorId &&
    disableAuthor(authorId)
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
  const authorId = getState().dashboardAuthor.selectedRow.id;
  authorId &&
    enableAuthor(authorId)
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
  const authorId = getState().dashboardAuthor.selectedRow.id;
  authorId &&
    deleteAuthor(authorId)
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
export default AuthorSlice.reducer;
