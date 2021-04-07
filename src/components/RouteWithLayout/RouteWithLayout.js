import React from 'react';
import { Route,Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteWithLayout = props => {
  const { path,layout: Layout, component: Component, ...rest } = props;
  let isLogin = sessionStorage.getItem("admin_id") ? true : false;
  if(path==='/sign-in'|| path==='/sign-up' || path==='/forgot'){
    isLogin = true;
  }
  
  //console.log(isLogin);
  //console.log(path);

  return (
    <Route 
      {...rest}
      render={matchProps => 
        (
          isLogin ?
          <Layout>
          <Component {...matchProps} />
          </Layout> :
          <Redirect to="/sign-in" />
        )
      
      }
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
