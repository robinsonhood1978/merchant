import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  TextField,
  Typography,
  Dialog, DialogActions, DialogTitle, DialogContent 
} from '@material-ui/core';
import crypto from 'crypto';
import {adminChangePassword} from '../../../../api/user';

const Md5 = password =>{
  const md5 = crypto.createHash('md5');
  return md5.update(password).digest('base64');
}

const schema = {
  oldPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    format: {
      pattern: "[a-z0-9]+",
      message: ' is not a valid oldPassword'
    },
    length: {
      minimum: 6,
      message: 'too short'
    }
  },
  newPassword: {
    presence: { allowEmpty: false, message: 'is required' },
    format: {
      pattern: "[a-z0-9]+",
      message: ' is not a valid newPassword'
    },
    length: {
      minimum: 6,
      message: 'too short'
    }
  },
  confirmPassword: {
    equality: "newPassword"
  }
};

const useStyles = makeStyles(() => ({
  root: {}
}));

const Password = props => {
  //console.log(props.history);
  const { history, className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    isValid: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    touched: {},
    errors: {}
  });

  const hasError = field =>
    values.touched[field] && values.errors[field] ? true : false;
    
  useEffect(() => {
    const errors = validate(values, schema);
    setValues(values => ({
      ...values,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [values]);

  const handleChange = event => {
    event.persist();

    setValues({
      ...values,
      [event.target.name]: event.target.value,
      touched: {
        ...values.touched,
        [event.target.name]: true
      }
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    //console.log(props);
    let oldPassword = Md5(values.oldPassword);
    let newPassword = Md5(values.newPassword);
    //alert(oldPassword);
    adminChangePassword({oldPassword, newPassword}).then((response) => {
           console.log(response);
            if (response.status === 200) {
              setIsmodify(true);
              setMsg(response.message);
              setOpen(true);
                //history.push('/');
            }
            else {
              setMsg(response.message);
              setOpen(true);
            }
        }).catch(e => {
          console.log(e);
        });
    
  };
  const [ismodify, setIsmodify] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    if(ismodify){
      history.push("/");
    }
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form onSubmit={handleSubmit}>
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
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
          <TextField
            error={hasError('oldPassword')}
            helperText={
              hasError('oldPassword') ? values.errors.oldPassword[0] : null
            }
            fullWidth
            label="oldPassword"
            name="oldPassword"
            onChange={handleChange}
            type="password"
            value={values.oldPassword}
            variant="outlined"
          />
          <TextField
            error={hasError('newPassword')}
            helperText={
              hasError('newPassword') ? values.errors.newPassword[0] : null
            }
            fullWidth
            label="newPassword"
            name="newPassword"
            onChange={handleChange}
            type="password"
            value={values.newPassword}
            variant="outlined"
          />
          <TextField
            error={hasError('confirmPassword')}
            helperText={
              hasError('confirmPassword') ? values.errors.confirmPassword[0] : null
            }
            fullWidth
            label="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
            style={{ marginTop: '1rem' }}
            type="password"
            value={values.confirmPassword}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            disabled={!values.isValid}
            variant="outlined"
            type="submit"
          >
            Update
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
