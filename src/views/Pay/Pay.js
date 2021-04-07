import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  InputLabel,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  Typography,
  Dialog, DialogActions, DialogTitle, DialogContent 
} from '@material-ui/core';
import { makeOrder, pay } from 'api/user';

const useStyles = makeStyles(() => ({
  root: {}
}));

const Pay = props => {
  const arr =props.location.pathname.split('/');
  const order_id = arr[arr.length-1];
  console.log(order_id)
  const { history,className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    pay_type: 'IE0012'
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };
  // IE0011 = qrcode_alipay;
  // IE0012 = web_alipay;
  // IE0013 = wap_alipay;
  // IE0015 = app_alipay;
  // IE0021 = qrcode_wechat;
  // IE0022 = wap_wechat;
  // IE0023 = wap_wechat_quickpay;
  // IE0025 = app_wechat;
  // IE0031 = UNION;
  // IE0041 = POLI;
  const pay_types = [
    {
      value: 'IE0013',
      label: 'wap_alipay'
    },
    {
      value: 'IE0011',
      label: 'qrcode_alipay'
    },
    {
      value: 'IE0012',
      label: 'web_alipay'
    },
    {
      value: 'IE0021',
      label: 'qrcode_wechat'
    },
    {
      value: 'IE0022',
      label: 'wap_wechat'
    },
    {
      value: 'IE0023',
      label: 'wap_wechat_quickpay'
    },
    {
      value: 'IE0031',
      label: 'UNION'
    },
    {
      value: 'IE0041',
      label: 'POLI'
    }
  ];
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    //history.push('/');
  };
  const payNow = () => {
    const {pay_type} = values;
    pay({order_id,pay_type}).then((response) => {
      console.log(response)
        if (response.status === 200) {
            let payurl =response.data.data;
            console.log(payurl)
            window.location.href=payurl;
            //window.open(payurl,"_blank"); 
            //history.push(payurl);
        }
        else {
          setMsg(response.message);
          setOpen(true);
        }
    }).catch(e => {
        setMsg(e);
        setOpen(true);
    });
  }       
  return (
    <div className={classes.root}>
      <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          System Information
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {msg}
          </Typography>
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Got it!
          </Button>
        </DialogActions>
      </Dialog>
    </div>
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
              <InputLabel>Select Payment Way</InputLabel>
              <TextField
                fullWidth
                margin="dense"
                name="pay_type"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.pay_type}
                variant="outlined"
              >
                {pay_types.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
           
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={payNow}
          >
            Pay Now
          </Button>
        </CardActions>
      </form>
    </Card>
        </Grid>
      </Grid>
    </div>
    
  );
};

Pay.propTypes = {
  className: PropTypes.string
};

export default Pay;
