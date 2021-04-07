import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import crypto from 'crypto';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography,
  Dialog, DialogActions, DialogTitle, DialogContent 
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {login,getVerify,loginPhone} from '../../api/user';
import {setInfo} from "../../utils/auth";

import SwipeableViews from 'react-swipeable-views';
import { makeStyles,useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

const schema = {
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

const schema2 = {
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
  }
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    //width: 500,
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
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));
const Md5 = password =>{
  const md5 = crypto.createHash('md5');
  return md5.update(password).digest('base64');
}

const SignIn = props => {
  
  const { history } = props;

  const classes = useStyles();

  const [formState, setFormState] = useState({
    isValid: false,
    isValid2: false,
    values: {},
    touched: {},
    errors: {}
  });
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = index => {
    setValue(index);
  };

  useEffect(() => {
    const errors = validate(formState.values, schema);
    const errors2 = validate(formState.values, schema2);
    setFormState(formState => ({
      ...formState,
      isValid: errors ? false : true,
      isValid2: errors2 ? false : true,
      errors: errors || {}
    }));
  }, [formState.values]);

  const handleBack = () => {
    history.goBack();
  };

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

  

  const handleSignIn = event => {
    event.preventDefault();
    //alert(formState.values.email);
    let email = formState.values.email;
    let password = Md5(formState.values.password);
    login({username:email, password}).then((response) => {
            if (response.data.status === 200) {
                setInfo(response.data.userid);
                console.log(history);
                history.push('/');
            }
            else {
                setMsg(response.data.message);
                setOpen(true);
            }
        }).catch(e => {
          console.log(e);
        });
    
  };
  
  const hasError = field =>
    formState.touched[field] && formState.errors[field] ? true : false;

  const sendTxt = () => {
    let {phone} = formState.values;
      getVerify({ phone}).then(data => {
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

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const handleClose = () => {
    setOpen(false);
    //history.push('/');
  };

  const mobileLogin = () => {
    const {phone,verifycode} = formState.values;
    //alert(verifycode);
    loginPhone({verify:verifycode, phone}).then((response) => {
            if (response.status === 200) {
                setInfo(response.username);
                history.push('/');
            }
            else {
              setMsg(response.message);
              setOpen(true);
            }
        }).catch(e => {
            setMsg(e);
            setOpen(true);
        });
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
                onSubmit={handleSignIn}
              >
                <Typography
                  className={classes.title}
                  variant="h6"
                >
                  Sign in
                </Typography>
                
                <div className={classes.root}>
                <AppBar position="static" color="default">
                  <Tabs
                    value={value}
                    onChange={handleTab}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab label="Email Login" {...a11yProps(0)} />
                    <Tab label="Mobile Login" {...a11yProps(1)} />
                  </Tabs>
                </AppBar>
                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0} dir={theme.direction}>
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
                      className={classes.signInButton}
                      color="primary"
                      disabled={!formState.isValid}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Sign in now
                    </Button>
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
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
                    endicon={<Icon>send</Icon>}
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
                    <Button
                      className={classes.signInButton}
                      color="primary"
                      disabled={!formState.isValid2}
                      fullWidth
                      size="large"
                      onClick={mobileLogin}
                      type="button"
                      variant="contained"
                    >
                      Sign in now
                    </Button>
                  </TabPanel>
                </SwipeableViews>
              </div>

                
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don't have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/sign-up"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Forgot the password?{' '}
                  <Link
                    component={RouterLink}
                    to="/forgot"
                    variant="h6"
                  >
                    Reset password
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

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
