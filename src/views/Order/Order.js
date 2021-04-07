import React, { useState,useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { myOrder } from 'api/user';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Order = props => {
  const parsedUrl = new URL(window.location.href)
  const order_id = parsedUrl.searchParams.get('id');
  const { history,className, ...rest } = props;

  const classes = useStyles();
  const [order,setOrder] = useState([]);

  useEffect(() => {
    myOrder({id:order_id}).then(
      res => {
        if (res.data.status === 200) {
            setOrder(res.data.data);
        } else {
            alert("else");
        }
      }
    ).catch(err => {
        alert("error");
    })
  }, []);
    
  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={8}
          md={6}
          xl={8}
          xs={12}
        >
          <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          subheader=""
          title="Top Up"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              
            </Grid>
           
          </Grid>
        </CardContent>
        <Divider />
        
      </form>
    </Card>
        </Grid>
      </Grid>
    </div>
    
  );
};

Order.propTypes = {
  className: PropTypes.string
};

export default Order;
