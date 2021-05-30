import React, { useState } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { RootState } from 'stores/store';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from 'reducers/auth';
import { Link } from 'react-router-dom';
import {
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  IconButton,
  TextField,
  Grid,
} from '@material-ui/core';
const Login = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const validationSchema = yup.object({
    username: yup.string().trim().max(16).min(4).required('Hãy nhập tên người dùng'),
    password: yup.string().trim().max(50).min(4).required('Hãy nhập mật khẩu'),
  });
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(login(values));
    },
  });

  return (
    <Container maxWidth="sm" style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} style={{ padding: 50 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item>
              <Typography component="h1" variant="h5">
                Đăng nhập
              </Typography>
            </Grid>
            {user ? (
              <>
                <Grid item xs={12}>
                  <Typography align="center">Bạn đã đăng nhập, bạn có muốn đăng xuất?</Typography>
                  <Link to="/">Về trang chủ</Link>
                </Grid>
                <Grid item xs={12}>
                  <Button color="primary" variant="contained" fullWidth size="large" onClick={() => dispatch(logout())}>
                    Đăng xuất
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    id="username"
                    name="username"
                    label="Tên người dùng"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="password"
                    name="password"
                    label="Mật khẩu"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button color="primary" variant="contained" type="submit" fullWidth size="large">
                    Đăng nhập
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
