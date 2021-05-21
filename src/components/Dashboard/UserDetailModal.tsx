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
function CustomModal({
  open,
  edit,
  setMode,
}: // detail
{
  open: boolean;
  edit: boolean;
  // detail: OrderDetail;
  setMode: React.Dispatch<React.SetStateAction<{ open: boolean; edit: boolean }>>;
}) {
  // console.log('Modal render', detail);
  return (
    <Dialog
      open={open}
      onClose={() =>
        setMode({
          open: false,
          edit: false,
        })
      }
      aria-labelledby="form-dialog-title"
      maxWidth="md"
      fullWidth={true}
    >
      <DialogTitle id="form-dialog-title">{edit ? 'Chỉnh sửa người dùng' : 'Thông tin người dùng'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Họ tên
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value="" />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Tên người dùng
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value="" />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Email
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value="" />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Số điện thoại
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value="" />
          </Grid>
          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Giới tính
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value="" />
          </Grid>

          <Grid item xs={12} sm={3} md={2}>
            <Typography variant="body1" component="span">
              Ngày sinh
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={4}>
            <TextField fullWidth disabled value="" />
          </Grid>
          {edit ? (
            <>
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
                    <TextField fullWidth disabled value="" />
                  </Grid>
                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body1" component="span">
                      Quận huyện
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <TextField fullWidth disabled value="" />
                  </Grid>
                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body1" component="span">
                      Phường xã
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <TextField fullWidth disabled value="" />
                  </Grid>
                  <Grid item xs={12} sm={3} md={2}>
                    <Typography variant="body1" component="span">
                      Số đường/nhà
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <TextField fullWidth disabled value="" />
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} sm={3} md={2}>
                <Typography variant="body1" component="span">
                  Địa chỉ
                </Typography>
              </Grid>
              <Grid item xs={12} sm={9} md={10}>
                <TextField fullWidth disabled multiline rows={2} value="" />
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
              edit: false,
            })
          }
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default React.memo(CustomModal);
