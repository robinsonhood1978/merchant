import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {getAdvertise} from 'api/user';

import { AdEditProfile, AdEditDetails,AdEditPhotos } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const EditAd = props => {
  const classes = useStyles();
  const arr =props.location.pathname.split('/');
  const ad_id = arr[arr.length-1];
  const [ad,setAd] = useState();
  const [picurl,setPicurl] = useState([]);
  const [picwall,setPicwall] = useState([]);
  useEffect(() => {
    getAdvertise(ad_id).then(
      res => {
        if (res.data.status === 200) {
            console.log(res.data.data);
            setAd(res.data.data);
            const pics = [];
            pics.push(res.data.data.pic_url);
            setPicurl(pics);
            const photos = [];
            photos.push(res.data.data.photos);
            setPicwall(photos);
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
          lg={4}
          md={6}
          xl={4}
          xs={12}
        >
          {picurl.map((url,index) => (
            <AdEditProfile key={index} picurl={url}/>
          ))}
          
          <br/><br/>
          {picwall.map((wall,index) => (
            <AdEditPhotos key={index} picwall={wall}/>
          ))}
        </Grid>
        <Grid
          item
          lg={8}
          md={6}
          xl={8}
          xs={12}
        >
            <AdEditDetails adId={ad_id} {...props}/>
          
        </Grid>
      </Grid>
    </div>
  );
};

export default EditAd;
