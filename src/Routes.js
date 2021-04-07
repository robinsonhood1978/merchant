import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  AdList as AdListView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  Forgot as ForgotView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  AddAd as AddAdView,
  EditAd as EditAdView,
  TopUp as TopUpView,
  Pay as PayView,
  Orders as OrdersView,
  Order as OrderView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect exact from="/" to="/account" />
      <RouteWithLayout
        component={PayView}
        exact
        layout={MainLayout}
        path="/pay/:order_id"
      />
      <RouteWithLayout
        component={TopUpView}
        exact
        layout={MainLayout}
        path="/topUp"
      />
      <RouteWithLayout
        component={OrdersView}
        exact
        layout={MainLayout}
        path="/orders"
      />
      <RouteWithLayout
        component={OrderView}
        exact
        layout={MainLayout}
        path="/order_detail"
      />
      <RouteWithLayout
        component={EditAdView}
        exact
        layout={MainLayout}
        path="/editAd/:ad_id"
      />
      <RouteWithLayout
        component={AddAdView}
        exact
        layout={MainLayout}
        path="/addAd"
      />
      <RouteWithLayout
        component={AdListView}
        exact
        layout={MainLayout}
        path="/advertising"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={ForgotView}
        exact
        layout={MinimalLayout}
        path="/forgot"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
