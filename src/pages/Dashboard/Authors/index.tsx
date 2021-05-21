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

export default function Authors(props: any) {
  const [queryState, setQueryState] = useState<{
    selectedTab: string;
    currentPage: number;
    rowsPerPage: number;
    searchInput: string | undefined;
  }>({
    selectedTab: 'default',
    currentPage: 1,
    rowsPerPage: 10,
    searchInput: undefined,
  });
  const { selectedTab, currentPage, rowsPerPage, searchInput } = queryState;
  const [searchInputValue, setSearchInputValue] = useState<string | undefined>('');
  const [dataGridRows, setDataGridRows] = useState<any[]>(rows);
  const [openActionMenu, setOpenActionMenu] = useState(false);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [seletedRowValue, setSelectedRowValue] = useState<GridRowData | null>(null);

  const [openAuthorModal, setOpenAuthorModal] = useState<{
    open: boolean;
    mode: 'edit' | 'view' | 'new';
  }>({
    open: false,
    mode: 'new',
  });
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dataGridRef = useRef<HTMLDivElement>(null);
  const getQueries = useCallback(() => {
    return parseQueries(location.search, {
      filter: selectedTab,
      search: undefined,
      page: currentPage,
      limit: rowsPerPage,
    });
  }, [location.search]);
  useEffect(function () {
    console.log('DID mount');
    const { filter, page, limit, search } = getQueries();
    setSearchInputValue(search);
    setQueryState({
      selectedTab: filter,
      currentPage: page,
      rowsPerPage: limit,
      searchInput: search,
    });
    console.log('Fetch data go br br', page, limit);
  }, []);
  useNonInitialEffect(() => {
    history.push({
      search: qs.stringify({
        filter: selectedTab,
        page: currentPage,
        limit: rowsPerPage,
        search: searchInput,
      }),
    });
  }, [selectedTab, currentPage, rowsPerPage, searchInput]);

  useNonInitialEffect(() => {
    console.log('history changed');
    const { filter, page, limit, search } = getQueries();
    setSearchInputValue(search);
    setQueryState({
      selectedTab: filter,
      currentPage: page,
      rowsPerPage: limit,
      searchInput: search,
    });
    console.log('Fetch data go br br', currentPage, rowsPerPage);
  }, [location.search]);
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
          setOpenAuthorModal({
            open: true,
            mode: 'view',
          });
        },
      },
      {
        title: 'Chỉnh sửa thông tin',
        onClick: () => {
          setOpenActionMenu(false);
          setOpenAuthorModal({
            open: true,
            mode: 'edit',
          });
        },
      },
      {
        title: 'Xoá tác giả',
        onClick: () => {
          console.log('delete author');
        },
      },
    ],
    [],
  );
  const cols = React.useMemo(
    () => [
      { field: 'id', headerName: 'Mã tác giả', width: 100 },
      { field: 'name', headerName: 'Tên tác giả', flex: 1 },
      { field: 'description', headerName: 'Giới thiệu về tác giả', flex: 3 },
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
                setSelectedRowValue(params.row);
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
        setQueryState({
          ...queryState,
          selectedTab: 'default',
        });
      },
    },
    {
      label: 'Bị xoá (ẩn)',
      value: 'deleted',
      onClick: () => {
        setQueryState({
          ...queryState,
          selectedTab: 'deleted',
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
            <Typography color="textPrimary">Quản lí tác giả</Typography>
          </Breadcrumbs>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={true}>
              <Typography variant="h4" component="h2">
                Quản lí tác giả
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
                onClick={() =>
                  setOpenAuthorModal({
                    open: true,
                    mode: 'new',
                  })
                }
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
                <Tabs value={selectedTab} indicatorColor="primary" textColor="primary">
                  {tabs.map(({ label, value, onClick }, index) => (
                    <Tab key={index} label={label} value={value} onClick={onClick} />
                  ))}
                </Tabs>
              </Grid>
              <Grid item xs={12} md="auto" lg={4}>
                <div className={classes.search}>
                  <InputBase
                    placeholder="Search…"
                    value={searchInputValue}
                    onKeyUp={(event: React.KeyboardEvent) => {
                      if (event.key === 'Enter') {
                        setQueryState({
                          ...queryState,
                          searchInput: searchInputValue,
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
                        setQueryState({
                          ...queryState,
                          searchInput: searchInputValue,
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
            {!!dataGridRows.length && (
              <Paper elevation={1} style={{ padding: 10 }}>
                <div style={{ flex: 1 }}>
                  <DataGrid
                    rowCount={100}
                    paginationMode="server"
                    ref={dataGridRef}
                    autoHeight
                    rows={dataGridRows}
                    columns={cols}
                    page={currentPage - 1}
                    pageSize={rowsPerPage}
                    onPageChange={(param: GridPageChangeParams) => {
                      setQueryState({
                        ...queryState,
                        currentPage: param.page + 1,
                      });
                    }}
                    onPageSizeChange={(param: GridPageChangeParams) => {
                      setQueryState({
                        ...queryState,
                        rowsPerPage: param.pageSize,
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
                    {seletedRowValue &&
                      actionMenuItems &&
                      actionMenuItems.map(({ title, onClick, matches }, index) =>
                        !matches ||
                        (!!matches &&
                          Object.keys(matches)
                            .map((key: any) => matches[key] === seletedRowValue[key])
                            .every((value) => !!value)) ? (
                          <MenuItem key={index} onClick={onClick}>
                            {title}
                          </MenuItem>
                        ) : null,
                      )}
                  </Menu>
                  {openAuthorModal && (
                    <AuthorModal
                      mode={openAuthorModal.mode}
                      open={openAuthorModal.open}
                      setMode={setOpenAuthorModal}
                      item={seletedRowValue}
                    ></AuthorModal>
                  )}
                </div>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
