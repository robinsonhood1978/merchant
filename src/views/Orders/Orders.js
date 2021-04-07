import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import { OrdersToolbar, OrdersTable } from './components';
import { myOrders } from 'api/user';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const Orders = props => {
  //console.log(props)
  const classes = useStyles();

  //const [orders] = useState(mockData);

  const [orders,setOrders] = useState([]);

  useEffect(() => {
    myOrders().then(
      res => {
        if (res.data.status === 200) {
            console.log(res.data);
            setOrders(res.data.data);
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
      <OrdersToolbar {...props}/>
      <div className={classes.content}>
        <OrdersTable orders={orders} {...props}/>
      </div>
    </div>
  );
};

export default Orders;
