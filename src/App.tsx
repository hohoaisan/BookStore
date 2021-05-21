import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { Provider as ReduxProvider } from 'react-redux';
import store from 'stores/store';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const routes = [
  {
    path: '/dashboard',
    // options: {},
    Component: Dashboard,
  },
  {
    path: '/',
    Component: Home,
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
      <ThemeProvider theme={theme}>
        <div className="App">
          <CssBaseline />
          <Router>
            <Switch>
              {routes.map(({ path, Component, options }, index) => (
                <Route path={path} {...options} key={index}>
                  <Component />
                </Route>
              ))}
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
    </ReduxProvider>
  );
}

export default App;
