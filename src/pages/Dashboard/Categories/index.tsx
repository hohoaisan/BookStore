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

import CategoryModal from 'components/Dashboard/CategoryModal';
import parseQueries from 'helpers/parseQueries';
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
import { FETCH_CATEGORIES, DISABLE_CATEGORY, ENABLE_CATEGORY, REMOVE_CATEGORY } from 'reducers/dashboard/categories';

export default function Categories(props: any) {
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
    dispatch(setQueryState({ filter, page, limit, search }));
    dispatch(FETCH_CATEGORIES());
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
    dispatch(setQueryState({ filter, page, limit, search }));
    dispatch(FETCH_CATEGORIES());
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
        title: 'Ch???nh s???a danh m???c',
        onClick: () => {
          setOpenActionMenu(false);
          dispatch(setModalMode('edit'));
          dispatch(setOpenModal(true));
        },
      },
      {
        title: 'Xo?? (???n) danh m???c',
        onClick: () => {
          dispatch(DISABLE_CATEGORY());
          setOpenActionMenu(false);
        },
        matches: {
          deleted: false,
        },
      },
      {
        title: 'B??? xo?? danh m???c',
        onClick: () => {
          dispatch(ENABLE_CATEGORY());
          setOpenActionMenu(false);
        },
        matches: {
          deleted: true,
        },
      },
      {
        title: 'Xo?? danh m???c v??nh vi???n',
        onClick: () => {
          dispatch(REMOVE_CATEGORY());
          setOpenActionMenu(false);
        },
        matches: {
          deleted: true,
        },
      },
    ],
    [],
  );
  const cols = React.useMemo(
    () => [
      { field: 'id', headerName: 'M?? danh m???c', flex: 1 },
      { field: 'name', headerName: 'T??n danh m???c', flex: 3 },
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
      label: 'M???c ?????nh',
      value: 'default',
      onClick: () => {
        changeQueryState({
          filter: 'default',
        });
      },
    },
    {
      label: 'B??? xo?? (???n)',
      value: 'deleted',
      onClick: () => {
        changeQueryState({
          filter: 'deleted',
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
            <Typography color="textPrimary">Qu???n l?? danh m???c</Typography>
          </Breadcrumbs>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={true}>
              <Typography variant="h4" component="h2">
                Qu???n l?? danh m???c
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton edge="start" color="inherit" aria-label="refresh page" onClick={() => console.log('refresh')}>
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
                Th??m m???i
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
                  {openModal && <CategoryModal></CategoryModal>}
                </div>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
