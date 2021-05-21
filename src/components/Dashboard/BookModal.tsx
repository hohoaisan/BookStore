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
  const formik = useFormik({
    initialValues: {
      id: '',
      name: '',
      author: 'Tô Hoài',
      category: 'Văn học',
      page: 1,
      weight: '',
      publisher: '',
      cover_type: '',
      publish_day: '25-11-1999',
      quantity: 1932,
      price: 15000,
      description: '',
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  const title = React.useMemo(() => {
    switch (modalMode) {
      case 'edit':
        return 'Chỉnh sửa sách';
      case 'view':
        return 'Xem thông tin sách';
      case 'new':
      default:
        return 'Thêm sách mới';
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
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Tên sách
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="name"
                name="name"
                disabled={disabled}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Tác giả
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="author"
                name="author"
                disabled={disabled}
                value={formik.values.author}
                onChange={formik.handleChange}
                error={formik.touched.author && Boolean(formik.errors.author)}
                helperText={formik.touched.author && formik.errors.author}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Số trang
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="page"
                name="page"
                disabled={disabled}
                value={formik.values.page}
                onChange={formik.handleChange}
                error={formik.touched.page && Boolean(formik.errors.page)}
                helperText={formik.touched.page && formik.errors.page}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Danh mục
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="category"
                name="category"
                disabled={disabled}
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Trọng lượng(g)
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="weight"
                name="weight"
                disabled={disabled}
                value={formik.values.weight}
                onChange={formik.handleChange}
                error={formik.touched.weight && Boolean(formik.errors.weight)}
                helperText={formik.touched.weight && formik.errors.weight}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Loại bìa
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="cover_type"
                name="cover_type"
                disabled={disabled}
                value={formik.values.cover_type}
                onChange={formik.handleChange}
                error={formik.touched.cover_type && Boolean(formik.errors.cover_type)}
                helperText={formik.touched.cover_type && formik.errors.cover_type}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Nhà phát hành
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="publisher"
                name="publisher"
                disabled={disabled}
                value={formik.values.publisher}
                onChange={formik.handleChange}
                error={formik.touched.publisher && Boolean(formik.errors.publisher)}
                helperText={formik.touched.publisher && formik.errors.publisher}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Ngày phát hành
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="publish_day"
                name="publish_day"
                disabled={disabled}
                type="date"
                value={formik.values.publish_day}
                onChange={formik.handleChange}
                error={formik.touched.publish_day && Boolean(formik.errors.publish_day)}
                helperText={formik.touched.publish_day && formik.errors.publish_day}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Số lượng
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="quantity"
                name="quantity"
                type="number"
                disabled={disabled}
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Đơn giá
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={4}>
              <TextField
                id="price"
                name="price"
                disabled={disabled}
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3} md={2}>
              <Typography variant="body1" component="span">
                Mô tả về sách
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
              <TextField
                id="description"
                name="description"
                rows={4}
                rowsMax={10}
                multiline={true}
                disabled={disabled}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                fullWidth
              />
            </Grid>
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
