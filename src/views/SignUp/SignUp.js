import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  FormHelperText,
  Checkbox,
  Typography,
  Dialog, DialogActions, DialogTitle, DialogContent 
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import crypto from 'crypto';
import {register,getVerify} from '../../api/user';
//import CustomizedDialogs from '../../utils/confirm';
//import Layer from 'react-layui-layer';
//import CloseIcon from '@material-ui/icons/Close';


const schema = {
  phone: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  verifycode: {
    presence: { allowEmpty: false, message: 'is required' },
    format: {
      pattern: /^[0-9]{6}$/,
      message: ' is not a valid verify code'
    },
    length: {
      minimum: 6,
      maximum: 6
    }
  },
  firstName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  lastName: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/auth.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0)
  }
}));
const Md5 = password =>{
  const md5 = crypto.createHash('md5');
  return md5.update(password).digest('base64');
}
const SignUp = props => {


  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    isShow: false,
    values: {},
    touched: {},
    errors: {}
  });

  useEffect(() => {
    const errors = validate(formState.values, schema);

    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleChange = event => {
    event.persist();

    setFormState(formState => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]:
          event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true
      }
    }));
  };
  const sendTxt = () => {
    let {phone} = formState.values;
      getVerify({ phone}).then(data => {
          //console.log(data);
          if (data.status === 200) {
              setMsg("SMS text message has been sent successfully!");
              setOpen(true);
          }
          else {
            setMsg(data.message);
            setOpen(true);
          }
      }).catch(e => {
        setMsg(e);
        setOpen(true);
      })
  }
  const handleBack = () => {
    history.goBack();
  };

  const handleSignUp = event => {
    event.preventDefault();
    console.log(new Date().getTime());
    let {email,password,phone,verifycode,firstName,lastName} = formState.values;
    password = Md5(password);
    //alert(phone);
    // setFormState(formState => ({
    //   ...formState,
    //   isShow: true
    // }));
    register({ password, username:email, phone,verify:verifycode, firstname:firstName, lastname:lastName }).then(data => {
        console.log(data);
        if (data.data.status === 200) {
          setReg(true);
          setMsg("Registration Success");
          setOpen(true);
        }
        else {
          setMsg(data.data.message);
          setOpen(true);
        }
    }).catch(e => {
        setMsg(email);
        setOpen(true);
    })
    
  };

  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  
  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [reg, setReg] = React.useState(false);

  const handleClose = () => {
    setOpen(false);    
    if(reg){
        history.push('/sign-in');
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
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h1"
              >
                Hella narwhal Cosby sweater McSweeney's, salvia kitsch before
                they sold out High Life.
              </Typography>
              <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant="body1"
                >
                  Takamaru Ayako
                </Typography>
                <Typography
                  className={classes.bio}
                  variant="body2"
                >
                  Manager at inVision
                </Typography>
              </div>
            </div>
          </div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={handleSignUp}
              >
                <Typography
                  className={classes.title}
                  variant="h6"
                >
                  Create new account
                </Typography>
                
                <TextField
                  className={classes.textField}
                  error={hasError('phone')}
                  fullWidth
                  helperText={
                    hasError('phone') ? formState.errors.phone[0] : null
                  }
                  label="Mobile number"
                  name="phone"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.phone || ''}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  onClick={sendTxt}
                  endIcon={<Icon>send</Icon>}
                >
                  Send Verify Code
                </Button>
                <TextField
                  className={classes.textField}
                  error={hasError('verifycode')}
                  fullWidth
                  helperText={
                    hasError('verifycode') ? formState.errors.verifycode[0] : null
                  }
                  label="Verify Code"
                  name="verifycode"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.verifycode || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('firstName')}
                  fullWidth
                  helperText={
                    hasError('firstName') ? formState.errors.firstName[0] : null
                  }
                  label="First name"
                  name="firstName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.firstName || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('lastName')}
                  fullWidth
                  helperText={
                    hasError('lastName') ? formState.errors.lastName[0] : null
                  }
                  label="Last name"
                  name="lastName"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.lastName || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Email address"
                  name="email"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.email || ''}
                  variant="outlined"
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
                />
                
                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign up now
                </Button>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/sign-in"
                    variant="h6"
                  >
                    Sign in
                  </Link>
                  
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignUp.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignUp);
