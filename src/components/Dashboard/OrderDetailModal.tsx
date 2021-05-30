import React, { useState, useEffect, useRef } from 'react';
import useNonInitialEffect from 'hooks/useNonInitialEffect';
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
} from '@material-ui/core';
import { DataGrid, GridCellParams, GridRowData, GridPageChangeParams } from '@material-ui/data-grid';

import { useFormik, FormikHelpers } from 'formik';
import { RootState } from 'stores/store';
import { useSelector, useDispatch } from 'react-redux';
import {
  setQueryState,
  setDataGridRow,
  setDataGridSelectedRow,
  setOpenModal,
  setModalMode,
} from 'reducers/dashboard/dashboard';

import { FETCH_ORDER } from 'reducers/dashboard/orders';

const initValue = {
  id: null,
  user: '',
  status: '',
  timestamp: '',
  address: '',
  total: 0,
  receiver: '',
  phone: '',
  shipping: '',
  payment: '',
  totalItems: 0,
  items: [],
};

function CustomModal() {
  const dispatch = useDispatch();
  const { modalData, openModal, modalMode } = useSelector((state: RootState) => state.dashboard);

  const formik = useFormik({
    initialValues: initValue,
    // validationSchema: validationSchema,
    onSubmit: () => {},
  });
  const modalCloseHandler = () => {
    dispatch(setOpenModal(false));
    dispatch(setModalMode('view'));
  };
  const cols = [
    { field: 'id', headerName: 'Mã sách', width: 150 },
    { field: 'name', headerName: 'Tên sách', flex: 1 },
    { field: 'quantity', headerName: 'Số lượng', width: 150 },
    { field: 'price', headerName: 'Đơn giá', width: 150 },
    { field: 'total', headerName: 'Tổng tiền', width: 150 },
  ];
  useEffect(() => {
    dispatch(FETCH_ORDER());
  }, []);
  useNonInitialEffect(() => {
    const { id, user, status, timestamp, address, total, receiver, phone, shipping, payment, totalItems, items } =
      modalData;
    formik.setValues({
      id,
      user,
      status,
      timestamp,
      address,
      total,
      receiver,
      phone,
      shipping,
      payment,
      totalItems,
      items,
    });
  }, [modalData]);
  return (
    <Dialog
      open={openModal}
      onClose={modalCloseHandler}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">Thông tin đơn hàng {formik.values.id}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Tên người nhận
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField id="receiver" name="receiver" value={formik.values.receiver} disabled fullWidth />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Số điện thoại
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled id="phone" name="phone" value={formik.values.phone} />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Địa chỉ
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={10}>
            <TextField
              fullWidth
              disabled
              multiline
              rows={2}
              id="address"
              name="address"
              value={formik.values.address}
            />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              H.thức giao hàng
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled id="shipping" name="shipping" value={formik.values.shipping} />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              H.thức thanh toán
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled id="payment" name="payment" value={formik.values.payment} />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Tổng số sản phẩm
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled id="totalItems" name="totalItems" value={formik.values.totalItems} />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Tổng số tiền
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled id="total" name="total" value={formik.values.total} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" component="span">
              Danh sách sản phẩm trong đơn hàng
            </Typography>
          </Grid>
          <Grid item xs={12}>
            {formik.values.items.length ? (
              <DataGrid density="compact" pageSize={10} autoHeight rows={modalData.items} columns={cols} />
            ) : (
              <Typography align="center" color="error">
                Đơn hàng này không có sản phẩm nào
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={modalCloseHandler} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default React.memo(CustomModal);
