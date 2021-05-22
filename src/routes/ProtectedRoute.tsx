import React, { useState, ReactChildren } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import { RootState } from 'stores/store';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from 'reducers/auth';

// https://ui.dev/react-router-v5-protected-routes-authentication/

const ProtectedRoute = ({ path, children, ...rest }: { path: string; children: React.ReactChild; rest?: [any] }) => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  if (!user && !token) {
    return <Redirect to="/auth/login" />;
  }
  return <Route path={path} {...rest}>{children}</Route>;
};

export default ProtectedRoute;
