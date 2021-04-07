import React, { useState,useEffect } from 'react';
import validate from 'validate.js';
import DateFnsUtils from '@date-io/date-fns';
import { Editor } from 'components';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import config from 'config';
import { upload, uploadPhotos } from 'api/upload';
import emitter from 'utils/events';
import {getMyInfo,addAdvertise} from 'api/user'
import {
  Chip,
  Select,
  MenuItem,
  Input,
  Card,
  Typography,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  InputLabel,
  TextField,
  Dialog, DialogActions, DialogTitle, DialogContent 
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';

import moment from 'moment';
import { getAdminId } from 'utils/auth';

emitter.setMaxListeners(50);
const format = 'HH:mm';

const TimeTake = ({ myclass, myclass2, weekday, value, onChangeStart, onChangeEnd }) => (
  <React.Fragment>
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid alignItems="center"
        container>
      <InputLabel className={myclass} htmlFor="my-input">{weekday}</InputLabel>
    <KeyboardTimePicker
      value={moment(value[0], format)}
      format={format}
      className={myclass2}
      keyboardIcon={<AccessTimeIcon />}
      onChange={onChangeStart}
    />
    &nbsp;&nbsp;-&nbsp;&nbsp;
  <KeyboardTimePicker
      value={moment(value[1], format)}
      format={format}
      className={myclass2}
      keyboardIcon={<AccessTimeIcon />}
      onChange={onChangeEnd}
    />
    </Grid>
    </MuiPickersUtilsProvider>
  </React.Fragment>
)
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const schema = {
  level: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  days: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  name: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  },
  city: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  cup: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  nationality: {
    presence: { allowEmpty: false, message: 'is required' },
  },
  age: {
    presence: { allowEmpty: false, message: 'is required' },
    format: {
      pattern: /^[0-9]{2}$/,
      message: ' is not a valid value'
    },
  },
  halfhr: {
    presence: { allowEmpty: false, message: 'is required' },
    format: {
      pattern: /^[0-9]*$/,
      message: ' is not a valid value'
    },
  },
  onehr: {
    presence: { allowEmpty: false, message: 'is required' },
    format: {
      pattern: /^[0-9]*$/,
      message: ' is not a valid value'
    },
  },
  twohrs: {
    presence: { allowEmpty: false, message: 'is required' },
    format: {
      pattern: /^[0-9]*$/,
      message: ' is not a valid value'
    },
  },
  phone: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 32
    }
  }
};

const useStyles = makeStyles(() => ({
  root: {},
  multipleSelect:{
    height:'40px',
  },
  inputLabel: {
    width: '100px'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  inputFileSingle: {
    display: 'none'
  },
  timepicker: {
    width: '100px'
  },
}));

const AdDetails = props => {
  const { history,className, ...rest } = props;
  const classes = useStyles();

  const [values, setValues] = useState({
    isValid: false,
    phone: '1',
    name: '1',
    about_me: '',
    level: 0,
    days: 0,
    service_places:'',
    body: '',
    city: '',
    location: '',
    cup: '',
    hair: '',
    nationality: '',
    meeting_with:'',
    age:'',
    height:'',
    weight:'',
    halfhr:'',
    onehr:'',
    towhrs:'',
    touched: {},
    errors: {}
  });
  const admin_id = getAdminId();
  const [message, setMessage] = useState('Advertising Details');
  const [money, setMoney] = useState();
  const [balance, setBalance] = useState();
  const [moneyleft, setMoneyleft] = useState();
  const verifyMoney = (level, days) => {
    let cost = getCost(level, days);
    const money_left = money - cost;
    setMoneyleft(money_left);
    const isValidMoney = money_left > 0;
    //console.log(isValidMoney);
    return isValidMoney? (
      <p style={{ color: 'black' }}>
        Costs required: {cost}. Post-consumer balance: {money_left}
      </p>
    ) : (
        <p style={{ color: 'red' }}>The balance is not enough to purchase this time. Please re-select or recharge and try again.</p>
      );
  };

  const getCost = (level, days) => {
    let cost;
    switch (days) {
      case 7:
        level === 2 ? (cost = 30) : (cost = 20);
        break;
      case 31:
        level === 2 ? (cost = 90) : (cost = 60);
        break;
      case 93:
        level === 2 ? (cost = 180) : (cost = 120);
        break;
      default: break;
    }
    console.log("cost:"+cost);
    return cost;
  };


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
  useEffect(() => {
    getMyInfo()
      .then(res => {
        if (res.data.status === 200) {
          setMoney(res.data.data.money);
        }
      })
      .catch(err => {
        console.log(err);
      });
    
    // 组件装载完成以后声明一个自定义事件
    emitter.addListener('changeMessage', (message) => {
      setFile(message);
    });
    emitter.addListener('changePhotos', (photos) => {
      setFiles(photos);
    });
    return function cleanup() {
        emitter.removeListener('changeMessage', (msg) => {
          setMessage('销毁1:'+msg);
        })
        emitter.removeListener('changePhotos', (msg) => {
          setMessage('销毁2:'+msg);
        })
    };
  }, []);

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
    if(event.target.name==='days'||event.target.name==='level'){
      var level = document.getElementById("level").value*1;
      var days = document.getElementById("days").value*1;
      if(level && days){
          setBalance(verifyMoney(level,days));
      }
    }
    if(event.target.name==='about_me'){
      console.log(event.target.value);
    }
  };

  const cities = [
    {
      value: '',
      label: ''
    },
    {
      value: 'Auckland',
      label: 'Auckland'
    },
    {
      value: 'Hamilton',
      label: 'Hamilton'
    },
    {
      value: 'Tauranga',
      label: 'Tauranga'
    },
    {
      value: 'Rotorua',
      label: 'Rotorua'
    },
    {
      value: 'Wellington',
      label: 'Wellington'
    },
    {
      value: 'Queens town',
      label: 'Queens town'
    },
    {
      value: 'Christchurch',
      label: 'Christchurch'
    }
  ];
  const cups = [
    {
      value: '',
      label: ''
    },
    {
      value: 'A',
      label: 'A'
    },
    {
      value: 'B',
      label: 'B'
    },
    {
      value: 'C',
      label: 'C'
    },
    {
      value: 'D',
      label: 'D'
    },
    {
      value: 'E',
      label: 'E'
    },
    {
      value: 'F',
      label: 'F'
    },
    {
      value: 'F+',
      label: 'F+'
    }
  ];

  const hairs = [
    {
      value: '',
      label: ''
    },
    {
      value: 'Black',
      label: 'Black'
    },
    {
      value: 'Yellow',
      label: 'Yellow'
    },
    {
      value: 'Brown',
      label: 'Brown'
    },
    {
      value: 'White',
      label: 'White'
    },
    {
      value: 'Grey',
      label: 'Grey'
    },
    {
      value: 'Red',
      label: 'Red'
    },
    {
      value: 'Secret',
      label: 'Secret'
    }
  ];
  const meetingwiths = [
    {
      value: '',
      label: ''
    },
    {
      value: 'Man',
      label: 'Man'
    },
    {
      value: 'Woman',
      label: 'Woman'
    },
    {
      value: 'Man/Woman',
      label: 'Man/Woman'
    }
  ];
  const languages = [
    {
      value: 'English',
      label: 'English'
    },
    {
      value: 'Chinese',
      label: 'Chinese'
    },
    {
      value: 'Maori',
      label: 'Maori'
    },
    {
      value: 'Japanese',
      label: 'Japanese'
    },
    {
      value: 'Korean',
      label: 'Korean'
    }
  ];
  const service_places = [
    {
      value: '',
      label: ''
    },
    {
      value: 'Incall',
      label: 'Incall'
    },
    {
      value: 'Outcall',
      label: 'Outcall'
    },
    {
      value: 'Incall/Outcall',
      label: 'Incall/Outcall'
    }
  ];
  const levels = [
    {
      value: '',
      label: ''
    },
    {
      value: '1',
      label: 'General Users'
    },
    {
      value: '2',
      label: 'Vip Users'
    }
  ];
  const days = [
    {
      value: '',
      label: ''
    },
    {
      value: '7',
      label: 'One Week'
    },
    {
      value: '31',
      label: 'One Month'
    },
    {
      value: '93',
      label: 'Three Months'
    }
  ];
  
  const printContent=comment=>{
    setValues(values => ({
      ...values,
      about_me:comment
    }));
    console.log(comment);
  }
  const [file, setFile] = useState();
  const [files, setFiles] = useState([]);
  const [language, setLanguage] = useState([]);
  const handleLanguage = event => {
    setLanguage(event.target.value);
  };
  const handleAdDetails = event => {
    event.preventDefault();
    // Promise.all([upload({ file })])
    //     .then(([pic]) => {
    //       if (pic.data.status === 200 ) {
    //         const pic_url = config.baseURL + 'uploads/' + pic.data.filename;
            
    //         console.log(pic_url);
    //       }
    //     });
    //console.log(language);
    if(moneyleft<0){
      setMsg("The balance is not enough to purchase this time. Please re-select or recharge and try again.");
      setOpen(true);
      return;
    }
    if(!file){
      setMsg("Please upload main picture");
      setOpen(true);
    }
    else if(files.length===0){
      setMsg("Please upload photos into the photos wall.");
      setOpen(true);
    }
    else{
      Promise.all([upload({ file }),uploadPhotos({ files })])
        .then(([pic,photowall]) => {
          if (pic.data.status === 200 && photowall.data.status === 200 ) {
            const pic_url = config.baseURL + 'uploads/' + pic.data.filename;            
            //console.log(pic_url);
            const { filenames } = photowall.data;
            const photos = [];
            filenames.forEach(item => photos.push(config.baseURL + 'uploads/' + item));
            //console.log(JSON.stringify(photos));
            const about_me = values.about_me.split('\n');
            const dataToSubmit = {
              name: values.name,
              body: values.body,
              business_days,
              city: values.city,
              cup: values.cup,
              hair: values.hair,
              location: values.location,
              meeting_with: values.meeting_with,
              nationality: values.nationality,
              phone: values.phone,
              age: values.age,
              height: values.height,
              weight: values.weight,
              price: values.onehr,
              pic_url,
              admin_id,
              photos,
              level: values.level*1,
              days: values.days*1,
              service_place: values.service_place,
              language,
              about_me,
              rate: {
                half: values.halfhr,
                one: values.onehr,
                two: values.twohrs
              }
            };
            console.log(dataToSubmit);
            addAdvertise(dataToSubmit).then(res => {
              console.log(res);
              if (res.data.status === 200) {
                setMsg("Success!");
                setReg(true);
                setOpen(true);
              }
              else{
                setMsg(res.data.message);
                setOpen(true);
              }
            })
            .catch(err => {
              setMsg("Something is wrong!");
                setOpen(true);
            });
          }
        })
        
      }
    //let {phone} = values;
    //alert(JSON.stringify(business_days));
    // setFormState(formState => ({
    //   ...formState,
    //   isShow: true
    // }));
    // register({ password, username:email, phone,verify:verifycode, firstname:firstName, lastname:lastName }).then(data => {
    //     //console.log(data);
    //     if (data.status === 200) {
    //       setReg(true);
    //       setMsg("Registration Success");
    //       setOpen(true);
    //     }
    //     else {
    //       setMsg(data.message);
    //       setOpen(true);
    //     }
    // }).catch(e => {
    //     setMsg(email);
    //     setOpen(true);
    // })
    
  };
  const [business_days, setCompanyBusinessDays]
    = useState([
      ["10:00", "22:00"],
      ["10:00", "22:00"],
      ["10:00", "22:00"],
      ["10:00", "22:00"],
      ["10:00", "22:00"],
      ["10:00", "22:00"],
      ["10:00", "22:00"],
    ]);
  const onChange = (time, string, index, i) => {
    const newDays = JSON.parse(JSON.stringify(business_days))
    newDays[index][i] = string
    setCompanyBusinessDays(newDays)
  };

  const [open, setOpen] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [reg, setReg] = React.useState(false);

  const handleClose = () => {
    setOpen(false);    
    if(reg){
        history.push('/advertising');
    }
  };
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
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

      <form
        autoComplete="off"
        noValidate
        onSubmit={handleAdDetails}
      >
        <CardHeader
          subheader=""
          title={message}
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
             <TextField
                error={hasError('level')}
                helperText={
                  hasError('level') ? values.errors.level[0] : null
                }
                id="level"
                fullWidth
                label="Select Level"
                margin="dense"
                name="level"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.level}
                variant="outlined"
              >
                {levels.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                error={hasError('days')}
                helperText={
                  hasError('days') ? values.errors.days[0] : null
                }
                id="days"
                fullWidth
                label="Purchase time"
                margin="dense"
                name="days"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.days}
                variant="outlined"
              >
                {days.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Typography variant="h5" gutterBottom>
            {balance}
            </Typography>
            <Grid
              item
              md={12}
              xs={12}
            >
              
              <TextField
                fullWidth
                name="about_me"
                onChange={handleChange}
                id="outlined-multiline-static"
                label="Self introduction"
                multiline
                rows="4"
                value={values.about_me}
                className={classes.textField}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={hasError('name')}
                helperText={
                  hasError('name') ? values.errors.name[0] : null
                }
                fullWidth
                label="Title"
                margin="dense"
                name="name"
                onChange={handleChange}
                required
                value={values.name}
                variant="outlined"
              />
            </Grid>
            
            <Grid
              item
              md={6}
              xs={12}
            >
             <TextField
                fullWidth
                label="Figure"
                margin="dense"
                name="body"
                onChange={handleChange}
                value={values.body}
                variant="outlined"
              /> 
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
             <TextField
              error={hasError('service_place')}
              helperText={
                hasError('service_place') ? values.errors.city[0] : null
              }
                fullWidth
                label="Service Place"
                margin="dense"
                name="service_place"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.service_place}
                variant="outlined"
              >
                {service_places.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
              error={hasError('city')}
              helperText={
                hasError('city') ? values.errors.city[0] : null
              }
                fullWidth
                label="Select City"
                margin="dense"
                name="city"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.city}
                variant="outlined"
              >
                {cities.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Location"
                margin="dense"
                name="location"
                onChange={handleChange}
                value={values.location}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
              error={hasError('cup')}
              helperText={
                hasError('cup') ? values.errors.cup[0] : null
              }
                fullWidth
                label="Select Cup"
                margin="dense"
                name="cup"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.cup}
                variant="outlined"
              >
                {cups.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Select Hair"
                margin="dense"
                name="hair"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.hair}
                variant="outlined"
              >
                {hairs.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
              error={hasError('nationality')}
              helperText={
                hasError('nationality') ? values.errors.nationality[0] : null
              }
                fullWidth
                label="Nationality"
                margin="dense"
                name="nationality"
                onChange={handleChange}
                required
                value={values.nationality}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Facing the crowd"
                margin="dense"
                name="meeting_with"
                onChange={handleChange}
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.meeting_with}
                variant="outlined"
              >
                {meetingwiths.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <InputLabel htmlFor="outlined-age-native-simple">
              Select Language
              </InputLabel>
              <Select
              error={hasError('language')}
              helperText={
                hasError('language') ? values.errors.language[0] : null
              }
                fullWidth
                className={classes.multipleSelect}
                label="Select Language"
                multiple
                value={language}
                onChange={handleLanguage}
                inputProps={{
                  name: 'language',
                  id: 'outlined-age-native-simple',
                }}
                input={<Input id="select-multiple-chip" />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {selected.map(value => (
                      <Chip key={value} label={value} className={classes.chip} />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {languages.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
             <TextField
                error={hasError('phone')}
                helperText={
                  hasError('phone') ? values.errors.phone[0] : null
                }
                fullWidth
                label="Phone"
                margin="dense"
                name="phone"
                onChange={handleChange}
                type="number"
                required
                value={values.phone}
                variant="outlined"
              /> 
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
              error={hasError('age')}
              helperText={
                hasError('age') ? values.errors.age[0] : null
              }
                fullWidth
                label="Age"
                margin="dense"
                name="age"
                type="number"
                onChange={handleChange}
                required
                value={values.age}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
             <TextField
                fullWidth
                label="Height"
                margin="dense"
                name="height"
                type="number"
                onChange={handleChange}
                value={values.height}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Weight"
                margin="dense"
                name="weight"
                type="number"
                onChange={handleChange}
                value={values.weight}
                variant="outlined"
              />
            </Grid>
            
            
            
            
            
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                error={hasError('halfhr')}
                helperText={
                  hasError('halfhr') ? values.errors.halfhr[0] : null
                }
                label="Half Hour Price"
                margin="dense"
                name="halfhr"
                onChange={handleChange}
                required
                type="number"
                value={values.halfhr}
                variant="outlined"
              />
              <TextField
                error={hasError('onehr')}
                helperText={
                  hasError('onehr') ? values.errors.onehr[0] : null
                }
                label="One Hour Price"
                margin="dense"
                name="onehr"
                onChange={handleChange}
                required
                type="number"
                value={values.onehr}
                variant="outlined"
              />
              <TextField
                error={hasError('twohrs')}
                helperText={
                  hasError('twohrs') ? values.errors.twohrs[0] : null
                }
                label="Two Hours Price"
                margin="dense"
                name="twohrs"
                onChange={handleChange}
                required
                type="number"
                value={values.twohrs}
                variant="outlined"
              />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
              <InputLabel>Business hours</InputLabel>
              <TimeTake myclass={classes.inputLabel} myclass2={classes.timepicker} weekday="Monday" value={business_days[0]}
              onChangeStart={(t, s) => { onChange(t, s, 0, 0) }}
              onChangeEnd={(t, s) => { onChange(t, s, 0, 1) }}
            />
            <TimeTake myclass={classes.inputLabel} myclass2={classes.timepicker} weekday="Tuesday" value={business_days[1]}
              onChangeStart={(t, s) => { onChange(t, s, 1, 0) }}
              onChangeEnd={(t, s) => { onChange(t, s, 1, 1) }}
            />
            <TimeTake myclass={classes.inputLabel} myclass2={classes.timepicker} weekday="Wednesday" value={business_days[2]}
              onChangeStart={(t, s) => { onChange(t, s, 2, 0) }}
              onChangeEnd={(t, s) => { onChange(t, s, 2, 1) }}
            />
            <TimeTake myclass={classes.inputLabel} myclass2={classes.timepicker} weekday="Thursday" value={business_days[3]}
              onChangeStart={(t, s) => { onChange(t, s, 3, 0) }}
              onChangeEnd={(t, s) => { onChange(t, s, 3, 1) }}
            />
            <TimeTake myclass={classes.inputLabel} myclass2={classes.timepicker} weekday="Friday" value={business_days[4]}
              onChangeStart={(t, s) => { onChange(t, s, 4, 0) }}
              onChangeEnd={(t, s) => { onChange(t, s, 4, 1) }}
            />
            <TimeTake myclass={classes.inputLabel} myclass2={classes.timepicker} weekday="Saturday" value={business_days[5]}
              onChangeStart={(t, s) => { onChange(t, s, 5, 0) }}
              onChangeEnd={(t, s) => { onChange(t, s, 5, 1) }}
            />
            <TimeTake myclass={classes.inputLabel} myclass2={classes.timepicker} weekday="Sunday" value={business_days[6]}
              onChangeStart={(t, s) => { onChange(t, s, 6, 0) }}
              onChangeEnd={(t, s) => { onChange(t, s, 6, 1) }}
            />
            </Grid>

            <Grid
              item
              md={12}
              xs={12}
            >
             <input type="file" className={classes.inputFileSingle}/>
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
            <input type="file" className={classes.inputFileSingle} multiple/>    
            </Grid>
            
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            disabled={!values.isValid}
            variant="contained"
            type="submit"
          >
            Save details
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AdDetails.propTypes = {
  className: PropTypes.string
};

export default AdDetails;
