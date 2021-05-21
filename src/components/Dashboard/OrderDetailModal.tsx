import React, { useState, useEffect, useRef } from 'react';
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

import OrderDetail from 'interfaces/Dashboard/OrderDetail';
import OrderDetailBook from 'interfaces/Dashboard/OrderDetailBook';

function CustomModal({
  open,
  setOpen,
  detail
}: {
  open: boolean;
  detail: OrderDetail;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const cols = [
    { field: 'id', headerName: 'Mã sách', width: 150 },
    { field: 'book_name', headerName: 'Tên sách', flex: 1 },
    { field: 'quantity_ordered', headerName: 'Số lượng', width: 150 },
    { field: 'price', headerName: 'Đơn giá', width: 150 },
    { field: 'total_money', headerName: 'Tổng tiền', width: 150 },
  ];
  console.log('Modal render', detail);
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">Thông tin đơn hàng {detail.id}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Tên người nhận
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value={detail.receiver} />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Số điện thoại
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value={detail.receiver_phone} />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Địa chỉ
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={10}>
            <TextField fullWidth disabled multiline rows={2} value={detail.receiver_address} />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              H.thức giao hàng
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value={detail.delivery_method} />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              H.thức thanh toán
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value={detail.payment_method} />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Tổng số sản phẩm
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value={detail.total_items} />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Tổng số tiền
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value={detail.total} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" component="span">
              Danh sách sản phẩm trong đơn hàng
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <DataGrid
              density="compact"
              pageSize={10}
              autoHeight
              rows={detail.books}
              columns={cols}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default React.memo(CustomModal);
