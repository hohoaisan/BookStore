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
  fetchAuthors,
  setDataGridSelectedRow,
  setOpenModal,
  setModalMode,
  fetchAuthor,
  createAuthor,
} from 'reducers/dashboard/authors';

const initValue = {
  id: '',
  name: '',
  description: '',
};
function CustomModal() {
  const dispatch = useDispatch();
  const { modalData, openModal, modalMode } = useSelector((state: RootState) => state.dashboardAuthor);
  const { title, onFormSubmit } = React.useMemo(() => {
    switch (modalMode) {
      case 'edit':
        return {
          title: 'Chỉnh sửa tác giả',
          onFormSubmit: (values: any) => alert('xửa' + JSON.stringify(values)),
        };
      case 'view':
        return {
          title: 'Xem thông tin tác giả',
          onFormSubmit: (values: any) => {},
        };
      case 'new':
      default:
        return {
          title: 'Thêm tác giả mới',
          onFormSubmit: (values: any, helpers: FormikHelpers<typeof initValue>) => {
            const { name, description } = values;
            dispatch(createAuthor({ name, description }));
          },
        };
    }
  }, [modalMode]);

  const formik = useFormik({
    initialValues: initValue,
    // validationSchema: validationSchema,
    onSubmit: onFormSubmit,
  });
  // When modalData changes, check if the mode was edit or view, set the formik form as the given value
  useEffect(() => {
    if (modalData && (modalMode === 'view' || modalMode === 'edit')) {
      const { id, name, description } = modalData;
      formik.setValues({ id, name, description });
    }
  }, [modalData]);

  useEffect(() => {
    switch (modalMode) {
      case 'edit':
      case 'view':
        dispatch(fetchAuthor());
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
      maxWidth="sm"
      fullWidth={true}
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Typography variant="body1" component="span">
                Tên tác giả
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                disabled={disabled}
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography variant="body1" component="span">
                Giới thiệu
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                multiline={true}
                rows={5}
                rowsMax={15}
                disabled={disabled}
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={modalCloseHandler} color="primary">
            Huỷ
          </Button>
          {modalMode === 'view' && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                dispatch(setModalMode('edit'));
              }}
            >
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
