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

import AuthorModal from 'components/Dashboard/AuthorModal';
import useStyles from 'styles/Dashboard/common';
import parseQueries from 'helpers/parseQueries';
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
import { FETCH_AUTHORS, DISABLE_AUTHOR, ENABLE_AUTHOR, REMOVE_AUTHOR } from 'reducers/dashboard/authors';

export default function Authors(props: any) {
  const { query, rows, rowCount, selectedRow, openModal } = useSelector((state: RootState) => state.dashboard);
  const { filter, page, limit, search } = query;
  const dispatch = useDispatch();
  const [searchValue, setsearchValue] = useState<string | undefined>('');
  const [openActionMenu, setOpenActionMenu] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  // const [seletedRowValue, setSelectedRowValue] = useState<GridRowData | null>(null);

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
    dispatch(FETCH_AUTHORS());
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
    dispatch(FETCH_AUTHORS());
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
        title: 'Xem th??ng tin chi ti???t',
        onClick: () => {
          setOpenActionMenu(false);
          dispatch(setModalMode('view'));
          dispatch(setOpenModal(true));
        },
      },
      {
        title: 'Ch???nh s???a th??ng tin',
        onClick: () => {
          setOpenActionMenu(false);
          dispatch(setModalMode('edit'));
          dispatch(setOpenModal(true));
        },
      },
      {
        title: 'Xo?? t??c gi???',
        onClick: () => {
          dispatch(DISABLE_AUTHOR());
          setOpenActionMenu(false);
        },
        matches: {
          deleted: false,
        },
      },
      {
        title: 'B??? xo?? t??c gi???',
        onClick: () => {
          dispatch(ENABLE_AUTHOR());
          setOpenActionMenu(false);
        },
        matches: {
          deleted: true,
        },
      },
      {
        title: 'Xo?? v??nh vi???n t??c gi???',
        onClick: () => {
          dispatch(REMOVE_AUTHOR());
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
      { field: 'id', headerName: 'M?? t??c gi???', width: 100 },
      { field: 'name', headerName: 'T??n t??c gi???', flex: 1 },
      { field: 'description', headerName: 'Gi???i thi???u v??? t??c gi???', flex: 3 },
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
      onClick: () =>
        changeQueryState({
          filter: 'default',
        }),
    },
    {
      label: 'B??? xo?? (???n)',
      value: 'deleted',
      onClick: () =>
        changeQueryState({
          filter: 'deleted',
        }),
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
            <Typography color="textPrimary">Qu???n l?? t??c gi???</Typography>
          </Breadcrumbs>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={true}>
              <Typography variant="h4" component="h2">
                Qu???n l?? t??c gi???
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <IconButton
                onClick={() => dispatch(FETCH_AUTHORS())}
                edge="start"
                color="inherit"
                aria-label="refresh page"
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
                    onPageChange={(param: GridPageChangeParams) =>
                      changeQueryState({
                        page: param.page + 1,
                      })
                    }
                    onPageSizeChange={(param: GridPageChangeParams) =>
                      changeQueryState({
                        limit: param.pageSize,
                      })
                    }
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
                  {openModal && <AuthorModal></AuthorModal>}
                </div>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
