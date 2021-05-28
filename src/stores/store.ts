import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import authReducer from 'reducers/auth';
import dashboardReducer from 'reducers/dashboard/dashboard';

const reducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer
});
const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof reducer>;

export default store