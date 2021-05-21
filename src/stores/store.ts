import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import authReducer from 'reducers/auth';

const reducer = combineReducers({
  auth: authReducer,
});
export default configureStore({
  reducer,
});

export type RootState = ReturnType<typeof reducer>;
