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
} from '@material-ui/core';
import { MoreHoriz as MoreHorizIcon, Replay as ReplayIcon, Search as SearchIcon } from '@material-ui/icons';
import { DataGrid, GridCellParams, GridRowData, GridPageChangeParams } from '@material-ui/data-grid';
import { BrowserRouter as Router, Switch, Route, useHistory, useLocation } from 'react-router-dom';

import parseQueries from 'helpers/parseQueries';

import OrderDetailModal from 'components/Dashboard/OrderDetailModal';
import useStyles from 'styles/Dashboard/common';
import numeral from 'numeral';

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
  FETCH_ORDERS,
  ACCEPT_ORDER,
  REJECT_ORDER,
  MARK_COMPLETED_ORDER,
  MARK_ERROR_ORDER,
} from 'reducers/dashboard/orders';

export default function Order(props: any) {
  const { query, rows, rowCount, selectedRow, openModal } = useSelector((state: RootState) => state.dashboard);
  const { filter, page, limit, search } = query;
  const dispatch = useDispatch();

  const [searchValue, setSearchInputValue] = useState<string | undefined>('');
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
    setSearchInputValue(search);
    setQueryState({
      filter: filter,
      page: page,
      limit: limit,
      search: search,
    });
    dispatch(FETCH_ORDERS());
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
    setSearchInputValue(search);
    setQueryState({
      filter: filter,
      page: page,
      limit: limit,
      search: search,
    });
    dispatch(FETCH_ORDERS());
  }, [location.search]);
  const changeQueryState = (item: object) => {
    dispatch(
      setQueryState({
        ...query,
        ...item,
      }),
    );
  };

  const actionMenuItems = React.useMemo(
    () => [
      {
        title: 'Xem th??ng tin chi ti???t ????n h??ng',
        onClick: () => {
          setOpenActionMenu(false);
          dispatch(setOpenModal(true));
        },
        matches: ['c', 'p', 'e', 'r', 'a'],
      },
      {
        title: 'Ti???p nh???n',
        onClick: () => {
          setOpenActionMenu(false);
          dispatch(ACCEPT_ORDER());
        },
        matches: ['p'],
      },
      {
        title: 'T??? ch???i',
        onClick: () => {
          setOpenActionMenu(false);
          dispatch(REJECT_ORDER());
        },
        matches: ['p'],
      },
      {
        title: '????nh d???u l?? l???i',
        onClick: () => {
          dispatch(MARK_ERROR_ORDER());
          setOpenActionMenu(false);
        },
        matches: ['p', 'r', 'a'],
      },
      {
        title: '????nh d???u l?? ho??n th??nh',
        onClick: () => {
          setOpenActionMenu(false);
          dispatch(MARK_COMPLETED_ORDER());
        },
        matches: ['a'],
      },
    ],
    [],
  );
  const cols = React.useMemo(
    () => [
      // { field: 'id', headerName: 'ID', width: 150 },
      {
        field: 'status',
        headerName: 'Tr???ng th??i',
        width: 150,
        renderCell: (params: GridCellParams) =>
          params.value === 'p' ? (
            <Typography color="primary">Ch??? x??c nh???n</Typography>
          ) : params.value === 'e' ? (
            <Typography color="error">????n l???i</Typography>
          ) : params.value === 'r' ? (
            <Typography color="error">T??? ch???i</Typography>
          ) : params.value === 'c' ? (
            <Typography color="textSecondary">Ho??n th??nh</Typography>
          ) : params.value === 'a' ? (
            <Typography color="primary">Ch??? thanh to??n</Typography>
          ) : (
            <Typography color="textSecondary">Kh??ng x??c ?????nh</Typography>
          ),
      },
      { field: 'id', headerName: 'M?? ????n', width: 110 },
      {
        field: 'timestamp',
        headerName: 'Ng??y mua',
        width: 100,
        flex: 1,
        renderCell: (params: GridCellParams) => (
          <span>{params.value && new Date(params.value as string).toLocaleString()}</span>
        ),
      },
      { field: 'user', headerName: 'Ng?????i mua', width: 150 },
      { field: 'receiver', headerName: 'Ng?????i nh???n', width: 150 },
      // { field: 'shipping', headerName: 'H.T.G.h??ng', width: 120 },
      // { field: 'payment', headerName: 'H.T.T.to??n', width: 120 },
      { field: 'totalItems', headerName: 'S??? s???n ph???m', width: 120 },
      {
        field: 'total',
        headerName: 'T???ng c???ng',
        width: 120,
        renderCell: (params: GridCellParams) => <span>{params.value && numeral(params.value).format('0,0')}</span>,
      },
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
                //fetch data for detail
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
      label: 'T???t c???',
      value: 'default',
      onClick: () => {
        changeQueryState({
          filter: 'default',
        });
      },
    },
    {
      label: 'Ch??? x??c nh???n',
      value: 'pending',
      onClick: () => {
        changeQueryState({
          filter: 'pending',
        });
      },
    },
    {
      label: 'Ch??? thanh to??n',
      value: 'accepted',
      onClick: () => {
        changeQueryState({
          filter: 'accepted',
        });
      },
    },
    {
      label: 'T??? ch???i',
      value: 'rejected',
      onClick: () => {
        changeQueryState({
          filter: 'rejected',
        });
      },
    },
    {
      label: '????n l???i',
      value: 'error',
      onClick: () => {
        changeQueryState({
          filter: 'error',
        });
      },
    },
    {
      label: 'Ho??n th??nh',
      value: 'completed',
      onClick: () => {
        changeQueryState({
          filter: 'completed',
        });
      },
    },
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
            <Typography color="textPrimary">Qu???n l?? ????n h??ng</Typography>
          </Breadcrumbs>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={true}>
              <Typography variant="h4" component="h2">
                Qu???n l?? ????n h??ng
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton edge="start" color="inherit" aria-label="refresh page" onClick={() => console.log('refresh')}>
                <ReplayIcon />
              </IconButton>
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
                {/* <div className={classes.search}>
                  <InputBase
                    placeholder="Search???"
                    value={searchValue}
                    onKeyUp={(event: React.KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        changeQueryState({
                          search: searchValue,
                        });
                      }
                    }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchInputValue(event.target.value);
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
                </div> */}
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
                        matches.includes(selectedRow.status) ? (
                          <MenuItem key={index} onClick={onClick}>
                            {title}
                          </MenuItem>
                        ) : null,
                      )}
                  </Menu>
                  {openModal && <OrderDetailModal />}
                </div>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
