import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import authReducer from 'reducers/auth';

const reducer = combineReducers({
  auth: authReducer,
});
const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof reducer>;

export default store