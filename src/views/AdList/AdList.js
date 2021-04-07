import React, { useState,useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Grid, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { ProductsToolbar, ProductCard } from './components';
import {getAdvertises} from 'api/user';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}));

const AdList = () => {
  const classes = useStyles();
  const [ads,setAds] = useState([]);

  useEffect(() => {
    getAdvertises().then(
      res => {
        if (res.data.status === 200) {
            console.log(res.data.data);
            setAds(res.data.data);
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
      <ProductsToolbar />
      <div className={classes.content}>
        <Grid
          container
          spacing={3}
        >
          {ads.map(ad => (
            <Grid
              item
              key={ad.id}
              lg={4}
              md={6}
              xs={12}
            >
              <ProductCard product={ad} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default AdList;
