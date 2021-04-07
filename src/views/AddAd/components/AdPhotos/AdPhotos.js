import React, { useState,useEffect}  from 'react';
import PropTypes from 'prop-types';
import emitter from '../../../../utils/events';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Divider,
  Button
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  ul:{
    float:'left',
    width:'100%',
    margin:'0px',
    padding:'0px',
    listStyleType:'none',
  },
  alt:{
    position: 'absolute',
    width:'100%',
    height:'100%',
    background:'#000',
    background:'url(/images/del.png) no-repeat center',
    display:'none',
    textAlign:'center'
  },
  li:{
    float:'left',
    width:'50%',
    marginTop:'0px',
    marginLeft:'0px',
    display:'inline',
    overflow: 'hidden'
  },
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



const AdPhotos = props => {
  function $(id){return typeof id === "string" ? document.getElementById(id) : id;}
function $$(oParent, elem){return (oParent || document).getElementsByTagName(elem);}
function imgLight(id)
{
    const oDiv=$(id); 
 const oImg=$$(oDiv,"img");  
 const oLi=$$(oDiv,"li"); 
 const oView=function(Obj)
 {
     var iMain=Obj;
  var iSpeed=1;
        var timer=null;
  iMain.onmouseout=function(){oClose(this);}
        timer=setInterval(function(){
      iMain.style.filter='alpha(opacity='+iSpeed+')';
            iMain.style.opacity=iSpeed/100;
      iSpeed+=1;
      if(iSpeed>=60){clearInterval(timer);}
   },1); 
 }
 const oClose=function(Obj)
 {
     var oMain=Obj;
  var oSpeed=60;
  var otimer=null;
        otimer=setInterval(function(){
      oMain.style.filter='alpha(opacity='+oSpeed+')';
            oMain.style.opacity=oSpeed/100;
      oSpeed-=1;
      if(oSpeed<=0){clearInterval(otimer);oMain.style.display="none";};
   },1); 
 }
 for(var i=0;i<oLi.length;i++)
 {
     var oThis=oLi[i];
     oThis.onmouseover=function()
  {
      var oWidth=$$(this,"img")[0].offsetWidth;
      var oHeight=$$(this,"img")[0].offsetHeight;
      this.firstChild.style.width=oWidth+"px";
   this.firstChild.style.height=oHeight+"px";
      this.firstChild.style.display="block";
   oView(this.firstChild);
  }
  oThis.onclick=function()
  {
      this.children[1].click();
  }
 }
}

  const classes = useStyles();

  const pic = {
    no: '/images/no.jpg'
  };
  const [fileurl, setFileurl] = useState(pic.no);
  const [files, setFiles] = useState([]);
  const [photos, setPhotos] = useState([]);
  
   useEffect(() => {
    imgLight("show");
    
   }, [photos]);
  const removePhotos = () =>{
    setPhotos([]);
    emitter.emit('changePhotos', '');
    document.getElementById("photos").style.display="";
  }
  const uploadPhotos = () =>{
    var upPhoto = document.getElementById("uploadPhotos");
    upPhoto.click();
  }
  const uploadMultipleFiles=(e)=> {
    document.getElementById("photos").style.display="none";
    let fileObj = [];
    let fileArray = [];
    fileObj.push(e.target.files)
    photos.forEach(item => fileArray.push(item));
    for (let i = 0; i < fileObj[0].length; i++) {
        fileArray.push(URL.createObjectURL(fileObj[0][i]))
    }
    setPhotos(fileArray);
    let newFileList = Array.from(e.target.files);
    setFiles(newFileList);
    emitter.emit('changePhotos', newFileList);
  }
  const removePic = e =>{
    let delIndex;
    setPhotos(photos.filter(item => item !== e.target.src))
    photos.forEach((item,index) => {
      if(item === e.target.src){
        delIndex=index;
      }
    });
    console.log(files)
    files.splice(delIndex,1);
    console.log(files)
    setFiles(files);
    
    emitter.emit('changePhotos', files);
    //alert(e.target.src);
  }

  return (
    <Card className={classes.card}>    
    <div className={classes.details}>
    <CardHeader
        title="Photos Wall"
      />
      <CardContent className={classes.content}>
          <img
            alt="photos wall"
            className={classes.image}
            src={fileurl}
            width="100%"
            id="photos"
          />
          <div>
                <div id="show">
                  <ul className={classes.ul}>
                    {(photos || []).map((url,index) => (
                        <li className={classes.li}>
                          <div className={classes.alt}>
                          </div>
                          <img src={url} key={index} width="100%" alt="..." onClick={removePic}/>
                          
                        </li>
                    ))}
                  </ul>
                </div>
                <div className={classes.fileinput}>
                    <input id="uploadPhotos" type="file" className="form-control" onChange={uploadMultipleFiles} multiple />
                </div>
            </div>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          className={classes.uploadButton}
          color="primary"
          variant="text"
          onClick={uploadPhotos}
        >
          Upload photos
        </Button>
        <Button variant="text" onClick={removePhotos}>Remove photos</Button>
      </CardActions>
    </div>
    
  </Card>
  );
};

AdPhotos.propTypes = {
  className: PropTypes.string
};

export default AdPhotos;
