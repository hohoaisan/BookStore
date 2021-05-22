import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import authReducer from 'reducers/auth';
import authorsReducer from 'reducers/dashboard/authors';

const reducer = combineReducers({
  auth: authReducer,
  dashboardAuthor: authorsReducer
});
const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof reducer>;

export default store