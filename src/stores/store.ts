import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from 'reducers/auth';
import dashboardReducer from 'reducers/dashboard/dashboard';

const reducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
});
// const store = configureStore({
//   reducer,
// });

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof reducer>;


export default store;
