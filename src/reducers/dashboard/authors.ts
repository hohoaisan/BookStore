import { Dispatch, AnyAction } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

import store from 'stores/store';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { getAuthors, getAuthor, createAuthor as crtAuthor } from 'apis/author';

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
      state.query = { filter, page, limit, search };
    },
    setDataGridRow: (state, action) => {
      const { rowCount, rows } = action.payload;
      state.rowCount = rowCount;
      state.rows = rows;
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

export const fetchAuthors = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
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

export const fetchAuthor = () => async (dispatch: Dispatch, getState: typeof store.getState) => {
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

export const createAuthor =
  ({ name, description }: { name: string; description: string }) =>
  async (dispatch: Dispatch, getState: typeof store.getState) => {
    // dispatch({ type: 'REQUEST_CREATE_NEW_AUTHOR' });
    crtAuthor({ name, description })
      .then((res) => {
        toast.success('Đã thêm tác giả mới');
        dispatch(setOpenModal(false));
        dispatch(setModalMode('new'));
        // dispatch(fetchAuthors());
        // dispatch({ type: 'SUCCESS_CREATE_NEW_AUTHOR' });
      })
      .catch((err) => {
        console.log(err);
        toast.error('Có vấn đề khi thêm tác giả mới');
        // dispatch({ type: 'FAILED_CREATE_NEW_AUTHOR' });
      });
  };
export default AuthorSlice.reducer;
