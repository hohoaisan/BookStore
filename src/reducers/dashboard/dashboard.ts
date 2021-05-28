import { Dispatch, AnyAction, ActionCreator } from 'redux';
import { createSlice } from '@reduxjs/toolkit';

import store from 'stores/store';
import axios, { AxiosRequestConfig } from 'axios';

interface queryType {
  filter: string;
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

export const dashboardSlice = createSlice({
  name: 'dashboard',
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
  dashboardSlice.actions;

export default dashboardSlice.reducer;
