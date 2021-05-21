import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useTheme, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { BrowserRouter as Router, Switch, Route, Link, useHistory, useLocation } from 'react-router-dom';
import {
  useMediaQuery,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  IconButton,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  MoveToInbox as InboxIcon,
  Mail as MailIcon,
  ShopTwo,
  ShoppingBasket as ShoppingBasketIcon,
  People as PeopleIcon,
  MenuBook as MenuBookIcon,
  Book as BookIcon,
  Face as FaceIcon,
} from '@material-ui/icons';
import useStyles from 'styles/Dashboard';

import Authors from './Authors';
import Books from './Books';
import Categories from './Categories';
import Orders from './Orders';
import Users from './Users';

const tabs = [
  {
    name: 'Quản lí đơn hàng',
    path: '/orders',
    icon: <ShoppingBasketIcon />,
    Component: Orders,
  },
  {
    name: 'Quản lí người dùng',
    path: '/users',
    icon: <PeopleIcon />,
    Component: Users,
  },
  {
    name: 'Quản lí sách',
    path: '/books',

    icon: <MenuBookIcon />,
    Component: Books,
  },
  {
    name: 'Quản lí danh mục sách',
    path: '/categories',
    icon: <BookIcon />,
    Component: Categories,
  },
  {
    name: 'Quản lí tác giả',
    path: '/authors',
    icon: <FaceIcon />,
    Component: Authors,
  },
];
function Dasboard() {
  const [openDrawer, setOpenDrawer] = React.useState(true);
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down('sm'));
  useEffect(
    // Hide the drawer when the app was resided or in mobile
    function () {
      if (isBelowSm && openDrawer) {
        setOpenDrawer(false);
        return;
      }
    },
    [isBelowSm],
  );
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="regular">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpenDrawer(!openDrawer)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            Chronicle Book
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        classes={{
          paper: clsx(classes.drawerPaper),
        }}
        open={openDrawer}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {tabs.map(({ name, path, icon }, index) => (
              <ListItem key={index} button onClick={() => history.push(path)} selected={location.pathname === path}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: openDrawer,
        })}
      >
        <Switch>
          {tabs.map(({ path, Component }, index) => (
            <Route path={path} key={index}>
              <Component />
            </Route>
          ))}
        </Switch>
      </main>
    </div>
  );
}
export default function wrapper(props: any) {
  return (
    <Router basename="dashboard">
      <Dasboard {...props} />
    </Router>
  );
}
