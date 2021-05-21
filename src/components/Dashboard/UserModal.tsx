import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
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

function CustomModal({
  open,
  setMode,
  mode,
  item,
}: {
  open: boolean;
  setMode: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      mode: 'edit' | 'view' | 'new';
    }>
  >;
  mode: 'edit' | 'view' | 'new';
  item?: GridRowData | null;
}) {
  const [modalMode, setModalMode] = useState(mode);
  useEffect(() => {
    setModalMode(mode);
  }, [mode]);
  const validationSchema = yup.object({
    username: yup.string().trim().max(25).min(8).required('Hãy nhập tên người dùng'),
    fullname: yup.string().trim().max(50).min(2).required('Hãy nhập họ tên'),
    phone: yup
      .number()
      .typeError('Hãy nhập số hợp lệ')
      .required('Hãy nhập số điện thoại')
      .positive('Hãy nhập số hợp lệ')
      .integer('Hãy nhập số hợp lệ'),
    email: yup.string().email('Hãy nhập email hợp lệ').required('Phải nhập email'),
  });
  const formik = useFormik({
    initialValues: {
      id: '',
      username: '',
      fullname: '',
      sex: 'M',
      phone: '',
      email: '',
      birthday: '2017-05-24',
      province: '',
      district: '',
      ward: '',
      address: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  const title = React.useMemo(() => {
    switch (modalMode) {
      case 'edit':
        return 'Chỉnh sửa người dùng';
      case 'view':
        return 'Xem thông tin người dùng';
      case 'new':
      default:
        return 'Thêm người dùng mới';
    }
  }, [modalMode]);
  const disabled = modalMode === 'view';
  return (
    <Dialog
      open={open}
      onClose={() =>
        setMode({
          open: false,
          mode: modalMode,
        })
      }
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
              <RadioGroup aria-label="sex" name="sex" value={formik.values.sex} onChange={formik.handleChange}>
                <FormControlLabel value="M" disabled={disabled} control={<Radio />} label="Nam" />
                <FormControlLabel value="F" disabled={disabled} control={<Radio />} label="Nữ" />
              </RadioGroup>
            </Grid>

            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Ngày sinh
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="birthday"
                name="birthday"
                type="date"
                disabled={disabled}
                value={formik.values.birthday}
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
          <Button
            onClick={() =>
              setMode({
                open: false,
                mode: modalMode,
              })
            }
            color="primary"
          >
            Huỷ
          </Button>
          {modalMode === 'view' && (
            <Button color="primary" variant="contained" onClick={() => setModalMode('edit')}>
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
