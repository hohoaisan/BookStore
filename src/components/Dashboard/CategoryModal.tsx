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
        return 'Chỉnh sửa danh mục';
      case 'new':
      default:
        return 'Thêm danh mục mới';
    }
  }, [modalMode]);
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
              <TextField
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
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
