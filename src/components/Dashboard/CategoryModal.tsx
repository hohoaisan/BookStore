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
  FETCH_CATEGORIES,
  DISABLE_CATEGORY,
  ENABLE_CATEGORY,
  REMOVE_CATEGORY,
  EDIT_CATEGORY,
  CREATE_CATEGORY,
  FETCH_CATEGORY,
} from 'reducers/dashboard/categories';

const initValue = {
  id: '',
  name: '',
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
          title: 'Chỉnh sửa danh mục',
          onFormSubmit: (values: any) => {
            const { id, name } = values;
            dispatch(EDIT_CATEGORY({ id, name }));
          },
        };
      case 'view':
        return {
          title: 'Xem thông tin danh mục',
          onFormSubmit: (values: any) => {},
        };
      case 'new':
      default:
        return {
          title: 'Thêm danh mục mới',
          onFormSubmit: (values: any, helpers: FormikHelpers<typeof initValue>) => {
            const { name } = values;
            dispatch(CREATE_CATEGORY({ name }));
          },
        };
    }
  }, [modalMode]);

  const formik = useFormik({
    initialValues: initValue,
    // validationSchema: validationSchema,
    onSubmit: onFormSubmit,
  });

  const modalCloseHandler = () => {
    dispatch(setOpenModal(false));
    dispatch(setModalMode('new'));
  };
  useEffect(() => {
    if (modalData && (modalMode === 'view' || modalMode === 'edit')) {
      const { id, name } = modalData;
      formik.setValues({ id, name });
    }
  }, [modalData]);

  useEffect(() => {
    switch (modalMode) {
      case 'edit':
      case 'view':
        dispatch(FETCH_CATEGORY());
        break;
      case 'new':
      default:
        formik.setValues(initValue);
    }
  }, [modalMode]);
  
  return (
    <Dialog
      open={openModal}
      onClose={modalCloseHandler}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
      fullWidth={true}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant="body1" component="span">
                Tên danh mục
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField id="name" name="name" value={formik.values.name} onChange={formik.handleChange} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={modalCloseHandler} color="primary">
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
