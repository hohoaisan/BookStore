import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, {persistor} from 'stores/store';

import Axios, { initAxiosInterceptors } from 'apis/instance';

import Home from 'pages/Home';
import Dashboard from 'pages/Dashboard';
import Login from 'pages/Auth/Login';
import ProtectedRoute from 'routes/ProtectedRoute';
// Axios.defaults.headers.common["Authorization"] = `Bearer ${store.getState().auth.token}`;
initAxiosInterceptors(store);

const routes = [
  {
    path: '/dashboard',
    // options: {},
    Component: Dashboard,
    isProtected: true,
  },
  {
    path: '/',
    Component: Home,
    options: {
      exact: true,
    },
  },
  {
    path: '/auth/login',
    Component: Login,
    options: {
      exact: true,
    },
  },
];

function App() {
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          // type: prefersDarkMode ? 'dark' : 'light',
          type: 'light',
        },
      }),
    // [prefersDarkMode],
    [],
  );
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <div className="App">
            <CssBaseline />
            <Router>
              <Switch>
                {routes.map(({ path, Component, options, isProtected }, index) =>
                  isProtected ? (
                    <ProtectedRoute path={path} {...options} key={index}>
                      <Component />
                    </ProtectedRoute>
                  ) : (
                    <Route path={path} {...options} key={index}>
                      <Component />
                    </Route>
                  ),
                )}
              </Switch>
            </Router>
          </div>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {/* Same as */}
        <ToastContainer />
      </PersistGate>
    </ReduxProvider>
  );
}

export default App;
