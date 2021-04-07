import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import QueueIcon from '@material-ui/icons/Queue';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import { logout } from '../../../../api/user';
import {removeInfo} from "../../../../utils/auth";
import { Button } from '@material-ui/core';

import { Profile, SidebarNav } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { history,open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  const pages = [
    {
      title: 'Advertising',
      href: '/advertising',
      icon: <ShoppingBasketIcon />
    },
    {
      title: 'Add Advertising',
      href: '/addAd',
      icon: <QueueIcon />
    },
    {
      title: 'Top Up',
      href: '/topUp',
      icon: <LocalAtmIcon />
    },
    {
      title: 'Orders',
      href: '/orders',
      icon: <LocalAtmIcon />
    },
    {
      title: 'Account',
      href: '/account',
      icon: <AccountBoxIcon />
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    }
  ];

  const handleLogout = event => {
    removeInfo();
    logout();
    props.children.props.history.push('/sign-in');
  };

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
        <Button onClick={handleLogout}>
            <PowerOffIcon />
            Logout
          </Button>
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
