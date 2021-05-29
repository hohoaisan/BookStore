import React, { useState, useEffect, useRef, useCallback } from 'react';
import useNonInitialEffect from 'hooks/useNonInitialEffect';
import qs from 'qs';
import {
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Paper,
  Toolbar,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  InputBase,
  Grid,
  Button,
  Icon,
} from '@material-ui/core';
import { MoreHoriz as MoreHorizIcon, Replay as ReplayIcon, Search as SearchIcon } from '@material-ui/icons';
import { useTheme, fade, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { DataGrid, GridCellParams, GridRowData, GridPageChangeParams } from '@material-ui/data-grid';
import { BrowserRouter as Router, Switch, Route, useHistory, useLocation } from 'react-router-dom';

import UserDataGridRow from 'interfaces/Dashboard/UserDataGridRow';
import parseQueries from 'helpers/parseQueries';

import UserModal from 'components/Dashboard/UserModal';
import useStyles from 'styles/Dashboard/common';
import rows from './rows';
// import detail from './detail';
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

export default function User(props: any) {
  const { query, rows, rowCount, selectedRow, openModal } = useSelector((state: RootState) => state.dashboard);
  const { filter, page, limit, search } = query;
  const dispatch = useDispatch();

  const [searchValue, setsearchValue] = useState<string | undefined>('');
  const [openActionMenu, setOpenActionMenu] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);

  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dataGridRef = useRef<HTMLDivElement>(null);
  const getQueries = useCallback(() => {
    return parseQueries(location.search, {
      filter: filter,
      search: undefined,
      page: page,
      limit: limit,
    });
  }, [location.search]);
  useEffect(function () {
    console.log('DID mount');
    const { filter, page, limit, search } = getQueries();
    setsearchValue(search);
    setQueryState({
      filter: filter,
      page: page,
      limit: limit,
      search: search,
    });
    dispatch(FETCH_USERS());
  }, []);

  useNonInitialEffect(() => {
    history.push({
      search: qs.stringify({
        filter: filter,
        page: 1,
        limit: 10,
        search: search,
      }),
    });
  }, [filter]);

  useNonInitialEffect(() => {
    history.push({
      search: qs.stringify({
        filter: filter,
        page: page,
        limit: limit,
        search: search,
      }),
    });
  }, [page, limit, search]);

  useNonInitialEffect(() => {
    console.log('history changed');
    const { filter, page, limit, search } = getQueries();
    setsearchValue(search);
    setQueryState({
      filter: filter,
      page: page,
      limit: limit,
      search: search,
    });
    dispatch(FETCH_USERS());
  }, [location.search]);

  const changeQueryState = (item: object) => {
    dispatch(
      setQueryState({
        ...query,
        ...item,
      }),
    );
  };

  const actionMenuItems: {
    title: string;
    onClick: () => void;
    matches?: {
      [key: string]: any;
    };
  }[] = React.useMemo(
    () => [
      {
        title: 'Xem thông tin chi tiết',
        onClick: () => {
          setOpenActionMenu(false);
          dispatch(setModalMode('view'));
          dispatch(setOpenModal(true));
        },
      },
      {
        title: 'Chỉnh sửa thông tin',
        onClick: () => {
          setOpenActionMenu(false);
          dispatch(setModalMode('edit'));
          dispatch(setOpenModal(true));
        },
      },
      {
        title: 'Đặt làm quản trị viên',
        onClick: () => {
          dispatch(SET_ADMIN());
          setOpenActionMenu(false);
        },
        matches: {
          admin: false,
        },
      },
      {
        title: 'Xoá vai trò quản trị viên',
        onClick: () => {
          dispatch(REMOVE_ADMIN());
          setOpenActionMenu(false);
        },
        matches: {
          admin: true,
        },
      },
      {
        title: 'Vô hiệu hoá người dùng',
        onClick: () => {
          dispatch(DISABLE_USER());
          setOpenActionMenu(false);
        },
        matches: {
          disable: false,
          admin: false,
        },
      },
      {
        title: 'Kích hoạt lại người dùng',
        onClick: () => {
          dispatch(ENABLE_USER());
          setOpenActionMenu(false);
        },
        matches: {
          disable: true,
        },
      },
      // {
      //   title: 'Xoá tài khoản',
      //   onClick: () => console.log('clicked'),
      //   matches: {
      //     admin: false,
      //   },
      // },
    ],
    [],
  );
  const cols = React.useMemo(
    () => [
      { field: 'id', headerName: 'Mã người dùng', width: 100 },
      { field: 'username', headerName: 'Tên người dùng', width: 150 },
      { field: 'fullname', headerName: 'Họ và tên', flex: 1 },
      {
        field: 'gender',
        headerName: 'Giới tính',
        width: 120,
        renderCell: (params: GridCellParams) => <span> {params.value === true ? 'Nam' : 'Nữ'}</span>,
      },
      { field: 'phone', headerName: 'Số điện thoại', width: 150 },
      { field: 'email', headerName: 'Email', width: 200 },
      {
        field: 'action',
        headerName: 'Action',
        width: 100,
        renderCell: (params: GridCellParams) => (
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open action"
              onClick={(event: React.MouseEvent) => {
                dispatch(setDataGridSelectedRow(params.row));
                setActionMenuAnchor(params.element as HTMLElement);
                setOpenActionMenu(true);
              }}
            >
              <MoreHorizIcon />
            </IconButton>
          </>
        ),
      },
    ],
    [],
  );
  const tabs = [
    {
      label: 'Mặc định',
      value: 'default',
      onClick: () => {
        changeQueryState({
          filter: 'default',
        });
      },
    },
    {
      label: 'Bị vô hiệu hoá',
      value: 'disabled',
      onClick: () => {
        changeQueryState({
          filter: 'disabled',
        });
      },
    },
    {
      label: 'Quản trị viên',
      value: 'admin',
      onClick: () => {
        changeQueryState({
          filter: 'admin',
        });
      },
    },
    // {
    //   label: 'Đã bị xoá',
    //   value: 'deleted',
    //   onClick: () => {
    //     changeQueryState({
    //       filter: 'deleted',
    //     });
    //   },
    // },
  ];
  return (
    <Paper elevation={0} className={classes.content}>
      <Container maxWidth="lg">
        <Box className={classes.header}>
          <Toolbar />
          <Breadcrumbs aria-label="breadcrumb" className={classes.breadcrumb}>
            <Link color="inherit" href="/dashboard">
              Dashboard
            </Link>
            <Typography color="textPrimary">Quản lí người dùng</Typography>
          </Breadcrumbs>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={true}>
              <Typography variant="h4" component="h2">
                Quản lí người dùng
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="refresh page"
                onClick={() => dispatch(FETCH_USERS())}
              >
                <ReplayIcon />
              </IconButton>
              <Button
                variant="contained"
                color="primary"
                endIcon={<Icon>add</Icon>}
                onClick={() => {
                  dispatch(setModalMode('new'));
                  dispatch(setOpenModal(true));
                }}
              >
                Thêm mới
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={12} sm={true}>
                <Tabs value={filter} indicatorColor="primary" textColor="primary">
                  {tabs.map(({ label, value, onClick }, index) => (
                    <Tab key={index} label={label} value={value} onClick={onClick} />
                  ))}
                </Tabs>
              </Grid>
              <Grid item xs={12} md="auto" lg={4}>
                <div className={classes.search}>
                  <InputBase
                    placeholder="Search…"
                    value={searchValue}
                    onKeyUp={(event: React.KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        changeQueryState({
                          search: searchValue,
                        });
                      }
                    }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setsearchValue(event.target.value);
                    }}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                  />
                  <div className={classes.searchIcon}>
                    <IconButton
                      size="small"
                      edge="start"
                      color="inherit"
                      aria-label="refresh page"
                      onClick={() =>
                        changeQueryState({
                          search: searchValue,
                        })
                      }
                    >
                      <SearchIcon />
                    </IconButton>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {!!rows.length && (
              <Paper elevation={1} style={{ padding: 10 }}>
                <div style={{ flex: 1 }}>
                  <DataGrid
                    // density="compact"
                    rowCount={rowCount}
                    paginationMode="server"
                    ref={dataGridRef}
                    autoHeight
                    rows={rows}
                    columns={cols}
                    page={page - 1}
                    pageSize={limit}
                    onPageChange={(param: GridPageChangeParams) => {
                      changeQueryState({
                        page: param.page + 1,
                      });
                    }}
                    onPageSizeChange={(param: GridPageChangeParams) => {
                      changeQueryState({
                        limit: param.pageSize,
                      });
                    }}
                    rowsPerPageOptions={[5, 10, 20]}
                    pagination
                  />
                  <Menu
                    id="simple-menu"
                    anchorEl={actionMenuAnchor}
                    keepMounted
                    open={openActionMenu}
                    onClose={() => setOpenActionMenu(false)}
                  >
                    {selectedRow &&
                      actionMenuItems &&
                      actionMenuItems.map(({ title, onClick, matches }, index) =>
                        !matches ||
                        (!!matches &&
                          Object.keys(matches)
                            .map((key: any) => matches[key] === selectedRow[key])
                            .every((value) => !!value)) ? (
                          <MenuItem key={index} onClick={onClick}>
                            {title}
                          </MenuItem>
                        ) : null,
                      )}
                  </Menu>
                  {openModal && <UserModal></UserModal>}
                </div>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
