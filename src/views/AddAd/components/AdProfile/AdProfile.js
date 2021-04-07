import React, { useState}  from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import emitter from '../../../../utils/events';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Avatar,
  Divider,
  Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  imageContainer:{
    textAlign: 'center'
  },
  fileinput: {
    display: 'none'
  },
  avatar: {
    marginLeft: 'auto',
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  },
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

const AdProfile = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const pic = {
    notfound: '/images/no.png',
    no: '/images/no.jpg'
  };
  

  const [file, setFile] = useState();
  const [fileurl, setFileurl] = useState(pic.notfound);
  const uploadSingleFile=(e)=> {
    setFile(e.target.files[0]);
    setFileurl(URL.createObjectURL(e.target.files[0]));
    emitter.emit('changeMessage', e.target.files[0]);
  }  
  const uploadImg=(e)=> {
    e.preventDefault()
    console.log(fileurl)
  }

  const uploadImage = () =>{
    var upImage = document.getElementById("uploadImage");
    upImage.click();
  }
  const removeImage = () =>{
    setFileurl(pic.notfound);
    setFile('');
    emitter.emit('changeMessage', '');
  }
  
   

  return (
    <div>
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            M
          </Avatar>
        }
        title="Main picture of advertisement"
      />
      <CardContent>
        <div className={classes.imageContainer}>
          <img
            alt="Product"
            className={classes.image}
            src={fileurl}
            width="100%"
          />
        </div>
        <div className={classes.fileinput}>
            <div className="form-group">
                <input id="uploadImage" type="file" className="form-control" onChange={uploadSingleFile} />
            </div>
            <button type="button" className="btn btn-primary btn-block" onClick={uploadImg}>Upload</button>
        </div>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          className={classes.uploadButton}
          color="primary"
          variant="text"
          onClick={uploadImage}
        >
          Upload picture
        </Button>
        <Button variant="text" onClick={removeImage}>Remove picture</Button>
      </CardActions>
    </Card>
    
  </div>
  );
};

AdProfile.propTypes = {
  className: PropTypes.string
};

export default AdProfile;
