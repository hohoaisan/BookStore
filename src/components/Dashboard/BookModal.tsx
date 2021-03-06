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
  Avatar,
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
import { FETCH_BOOKS, FETCH_BOOK, CREATE_BOOK, EDIT_BOOK, REMOVE_BOOK, ENABLE_BOOK } from 'reducers/dashboard/books';
import { getAll as getAuthors } from 'apis/author/index';
import { getAll as getCategories } from 'apis/categories/index';
import { uploadCover } from 'apis/books';

const initValue = {
  id: '',
  name: '',
  imageUrl: '',
  author: '',
  category: '',
  pages: 0,
  weight: 0,
  publisher: '',
  cover: 'Bìa mềm',
  publishDay: new Date().toISOString().split('T')[0],
  quantity: 0,
  price: 0,
  description: '',
};
const BASE_URL = process.env.REACT_APP_BASE_URL;

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
  const [authors, setAuthors] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  const { title, onFormSubmit } = React.useMemo(() => {
    switch (modalMode) {
      case 'edit':
        return {
          title: 'Chỉnh sửa sách',
          onFormSubmit: (values: any) => {
            let {
              id,
              name,
              description,
              imageUrl,
              pages,
              weight,
              publishDay,
              author,
              category,
              quantity,
              price,
              publisher,
              cover,
            } = values;
            dispatch(EDIT_BOOK({ ...values }));
          },
        };
      case 'view':
        return {
          title: 'Xem thông tin sách',
          onFormSubmit: (values: any) => {},
        };
      case 'new':
      default:
        return {
          title: 'Thêm sách mới',
          onFormSubmit: (values: any, helpers: FormikHelpers<typeof initValue>) => {
            const {
              name,
              description,
              imageUrl,
              pages,
              weight,
              publishDay,
              author,
              category,
              quantity,
              price,
              publisher,
              cover,
            } = values;
            // alert(JSON.stringify(values));
            dispatch(CREATE_BOOK(values));
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
        name,
        description,
        imageUrl,
        pages,
        weight,
        publishDay,
        author,
        category,
        quantity,
        price,
        publisher,
        cover,
      } = modalData;
      formik.setValues({
        id,
        name,
        description,
        imageUrl,
        pages: Number.parseInt(pages),
        weight: Number.parseInt(weight),
        publishDay: publishDay ? new Date(publishDay).toISOString().split('T')[0] : '',
        author,
        category,
        quantity: Number.parseInt(quantity),
        price: Number.parseInt(price),
        publisher,
        cover,
      });
    }
  }, [modalData]);
  useEffect(() => {
    switch (modalMode) {
      case 'edit':
      case 'view':
        dispatch(FETCH_BOOK());
        break;
      case 'new':
      default:
        formik.setValues(initValue);
    }
  }, [modalMode]);

  useEffect(() => {
    getAuthors({ filter: 'default', page: 1, limit: 1000000 }).then((res) => setAuthors(res.data.rows));
    getCategories({ filter: 'default', page: 1, limit: 1000000 }).then((res) => setCategories(res.data.rows));
  }, []);

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
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" alignItems="center" spacing={2}>
              <Grid item>
                <Avatar
                  imgProps={{ style: { objectFit: 'contain' } }}
                  src={
                    formik.values.imageUrl && formik.values.imageUrl.startsWith('http')
                      ? ''
                      : (BASE_URL as string) + formik.values.imageUrl
                  }
                  style={{ width: 200, height: 200 }}
                  variant="square"
                >
                  Chưa có ảnh
                </Avatar>
              </Grid>
              {!disabled && (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    let form = new FormData(event.target as HTMLFormElement);
                    uploadCover(form)
                      .then((res) => {
                        const path = res.data.path;
                        formik.setValues({
                          ...formik.values,
                          imageUrl: path,
                        });
                      })
                      .catch((err) => console.log(err));
                  }}
                >
                  <Grid item>
                    <Grid container spacing={2} justify="center">
                      <Grid item xs={12}>
                        <Button variant="contained" component="label" fullWidth>
                          Chọn ảnh
                          <input type="file" name="file" hidden />
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth type="submit">
                          Upload
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={formik.handleSubmit}>
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
                  <Select
                    id="author"
                    name="author"
                    disabled={disabled}
                    value={formik.values.author}
                    onChange={formik.handleChange}
                    fullWidth
                  >
                    {authors &&
                      authors.map(({ id, name }, index) => (
                        <MenuItem key={index} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                  <Typography variant="body1" component="span">
                    Số trang
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9} md={4}>
                  <TextField
                    id="pages"
                    name="pages"
                    type="number"
                    disabled={disabled}
                    value={formik.values.pages}
                    onChange={formik.handleChange}
                    error={formik.touched.pages && Boolean(formik.errors.pages)}
                    helperText={formik.touched.pages && formik.errors.pages}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                  <Typography variant="body1" component="span">
                    Danh mục
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={9} md={4}>
                  <Select
                    id="category"
                    name="category"
                    disabled={disabled}
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    fullWidth
                  >
                    {categories &&
                      categories.map(({ id, name }, index) => (
                        <MenuItem key={index} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                  </Select>
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
                    type="number"
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
                    id="cover"
                    name="cover"
                    disabled={disabled}
                    value={formik.values.cover}
                    onChange={formik.handleChange}
                    error={formik.touched.cover && Boolean(formik.errors.cover)}
                    helperText={formik.touched.cover && formik.errors.cover}
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
                    id="publishDay"
                    name="publishDay"
                    disabled={disabled}
                    type="date"
                    value={formik.values.publishDay}
                    onChange={formik.handleChange}
                    error={formik.touched.publishDay && Boolean(formik.errors.publishDay)}
                    helperText={formik.touched.publishDay && formik.errors.publishDay}
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
            </form>
          </Grid>
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
          <Button color="primary" variant="contained" onClick={() => formik.submitForm()}>
            Lưu
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
export default React.memo(CustomModal);
