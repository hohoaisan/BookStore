import React, { useState, useEffect, useRef } from 'react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import {
  Typography,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Input,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
} from '@material-ui/core';
import { DataGrid, GridCellParams, GridRowData, GridPageChangeParams } from '@material-ui/data-grid';
import { RootState } from 'stores/store';
import { useSelector, useDispatch } from 'react-redux';
import {
  setQueryState,
  setDataGridRow,
  setDataGridSelectedRow,
  setOpenModal,
  setModalMode,
} from 'reducers/dashboard/dashboard';

import {
  FETCH_USERS,
  FETCH_USER,
  CREATE_USER,
  EDIT_USER,
  // REMOVE_USER,
  DISABLE_USER,
  ENABLE_USER,
  SET_ADMIN,
  REMOVE_ADMIN,
} from 'reducers/dashboard/users';

const initValue = {
  id: '',
  username: '',
  fullname: '',
  gender: 'true',
  phone: '',
  email: '',
  // dob: '2017-05-24',
  dob: new Date().toISOString().split('T')[0],
  // province: '',
  // district: '',
  // ward: 0,
  address: '',
  // fullAddress: '',
  password: '',
};
function CustomModal() {
  const dispatch = useDispatch();
  const { modalData, openModal, modalMode } = useSelector((state: RootState) => state.dashboard);
  // const validationSchema = yup.object({
  //   username: yup.string().trim().max(25).min(8).required('Hãy nhập tên người dùng'),
  //   fullname: yup.string().trim().max(50).min(2).required('Hãy nhập họ tên'),
  //   phone: yup
  //     .number()
  //     .typeError('Hãy nhập số hợp lệ')
  //     .required('Hãy nhập số điện thoại')
  //     .positive('Hãy nhập số hợp lệ')
  //     .integer('Hãy nhập số hợp lệ'),
  //   email: yup.string().email('Hãy nhập email hợp lệ').required('Phải nhập email'),
  // });
  const { title, onFormSubmit } = React.useMemo(() => {
    switch (modalMode) {
      case 'edit':
        return {
          title: 'Chỉnh sửa người dùng',
          onFormSubmit: (values: typeof initValue) => {
            const { id, username, fullname, gender, phone, email, dob, address, password } = values;
            dispatch(EDIT_USER({ id, username, fullname, gender, phone, email, dob, address, password }));
          },
        };
      case 'view':
        return {
          title: 'Xem thông tin người dùng',
          onFormSubmit: (values: any) => {},
        };
      case 'new':
      default:
        return {
          title: 'Thêm người dùng mới',
          onFormSubmit: (values: typeof initValue, helpers: FormikHelpers<typeof initValue>) => {
            const { id, username, fullname, gender, phone, email, dob, address, password } = values;
            dispatch(
              CREATE_USER({
                username,
                fullname,
                gender: gender === 'true' ? true : false,
                phone,
                email,
                dob,
                address,
                password,
              }),
            );
          },
        };
    }
  }, [modalMode]);
  const formik = useFormik({
    initialValues: initValue,
    // validationSchema: validationSchema,
    onSubmit: onFormSubmit,
  });

  useEffect(() => {
    if (modalData && (modalMode === 'view' || modalMode === 'edit')) {
      const {
        id,
        username,
        fullname,
        gender,
        phone,
        email,
        // ward,
        dob,
        address,
        // fullAddress
      } = modalData;
      formik.setValues({
        ...initValue,
        id,
        username,
        fullname,
        gender: `${gender}`,
        phone,
        email,
        dob: dob ? new Date(dob).toISOString().split('T')[0] : '',
        // ward: Number.parseInt(ward),
        address,
        // fullAddress,
      });
    }
  }, [modalData]);
  useEffect(() => {
    switch (modalMode) {
      case 'edit':
      case 'view':
        dispatch(FETCH_USER());
        break;
      case 'new':
      default:
        formik.setValues(initValue);
    }
  }, [modalMode]);
  const disabled = modalMode === 'view';
  const modalCloseHandler = () => {
    dispatch(setOpenModal(false));
    dispatch(setModalMode('new'));
  };
  return (
    <Dialog
      open={openModal}
      onClose={modalCloseHandler}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      fullWidth={true}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Họ tên
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="fullname"
                name="fullname"
                disabled={disabled}
                value={formik.values.fullname}
                onChange={formik.handleChange}
                error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                helperText={formik.touched.fullname && formik.errors.fullname}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Tên người dùng
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="username"
                name="username"
                disabled={disabled}
                value={formik.values.username}
                onChange={formik.handleChange}
                error={formik.touched.username && Boolean(formik.errors.username)}
                helperText={formik.touched.username && formik.errors.username}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Email
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="email"
                name="email"
                disabled={disabled}
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Số điện thoại
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="phone"
                name="phone"
                disabled={disabled}
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Giới tính
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <RadioGroup aria-label="gender" name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                <FormControlLabel value="true" disabled={disabled} control={<Radio />} label="Nam" />
                <FormControlLabel value="false" disabled={disabled} control={<Radio />} label="Nữ" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Ngày sinh
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="dob"
                name="dob"
                type="date"
                disabled={disabled}
                value={formik.values.dob}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Địa chỉ
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              {/* {disabled && ( */}
              <TextField
                // id="fullAddress"
                // name="fullAddress"
                id="address"
                name="address"
                disabled={disabled}
                // value={formik.values.fullAddress}
                value={formik.values.address}
                onChange={formik.handleChange}
                fullWidth
              />
              {/* )} */}
              {/* {!disabled && (
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body1" component="span">
                      Tỉnh thành phố
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Select
                      id="province"
                      name="province"
                      disabled={disabled}
                      value={formik.values.province}
                      onChange={formik.handleChange}
                      fullWidth
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body1" component="span">
                      Quận huyện
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Select
                      id="district"
                      name="district"
                      disabled={disabled}
                      value={formik.values.district}
                      onChange={formik.handleChange}
                      fullWidth
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body1" component="span">
                      Phường xã
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <Select
                      id="ward"
                      name="ward"
                      disabled={disabled}
                      value={formik.values.ward}
                      onChange={formik.handleChange}
                      fullWidth
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body1" component="span">
                      Số đường/nhà
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <TextField
                      id="address"
                      name="address"
                      disabled={disabled}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              )} */}
            </Grid>
            {!disabled && (
              <>
                <Grid item xs={12} sm={3} md={2}>
                  <Typography variant="body1" component="span">
                    Mật khẩu
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9} md={10}>
                  <TextField
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    fullWidth
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={modalCloseHandler} color="primary">
            Huỷ
          </Button>
          {modalMode === 'view' && (
            <Button color="primary" variant="contained" onClick={() => dispatch(setModalMode('edit'))}>
              Chỉnh sửa
            </Button>
          )}
          {modalMode !== 'view' && (
            <Button color="primary" variant="contained" type="submit">
              Lưu
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
export default React.memo(CustomModal);
