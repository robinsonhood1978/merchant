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

const TopUp = props => {
  const { history,className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    amount: '',
    pay_type: 'IE0012'
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    //history.push('/');
  };
  const payNow = () => {
    
    const {amount,pay_type} = values;
    if(amount>0){
      makeOrder({total_price:amount}).then((response) => {
        console.log(response)
            if (response.status === 200) {
                let order_id =response.data.order_id;
                console.log(order_id)
                history.push("/pay/"+order_id);
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
    else{
      setMsg('Illegal input');
      setOpen(true);
    }
  };
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
              <InputLabel>Please specify the top up amount</InputLabel>
              <TextField
                fullWidth
                margin="dense"
                name="amount"
                onChange={handleChange}
                required
                type="number"
                value={values.amount}
                variant="outlined"
              />
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
            Make an order
          </Button>
        </CardActions>
      </form>
    </Card>
        </Grid>
      </Grid>
    </div>
    
  );
};

TopUp.propTypes = {
  className: PropTypes.string
};

export default TopUp;
