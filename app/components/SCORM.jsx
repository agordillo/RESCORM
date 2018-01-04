import React from 'react';
import * as SCORM_WRAPPER from '../vendors/SCORM_API_Wrapper.js';
import { scormConnected, updateUserProfile } from './../reducers/actions';

export default class SCORM extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    window.addEventListener("load", this.onLoad.bind(this));
    window.addEventListener("beforeunload", this.onUnload.bind(this));
  }
  componentWillUnmount(){
    window.removeEventListener("beforeunload", this.onUnload);
    window.removeEventListener("onload", this.onLoad);
  }
  componentDidUpdate(prevProps,prevState){
    if(SCORM_WRAPPER.isConnected()){
      var updateProgress = (prevProps.tracking.progress_measure != this.props.tracking.progress_measure);
      if(updateProgress){
        SCORM_WRAPPER.updateProgressMeasure(this.props.tracking.progress_measure);
      }
      var updateScore = (prevProps.tracking.score != this.props.tracking.score);
      if(updateScore){
        SCORM_WRAPPER.updateScore(this.props.tracking.score);
      }
      if(updateProgress||updateScore){
        SCORM_WRAPPER.commit();
      }
    }
  }
  onLoad(event){
    var scorm = new SCORM_WRAPPER.init(true);
    if(!SCORM_WRAPPER.isConnected()){
      return;
    }
    this.props.dispatch(scormConnected(scorm));
    
    //Init user profile
    var user = SCORM_WRAPPER.getUserProfile();
    // console.log("USER PROFILE");
    // console.log(user);
    this.props.dispatch(updateUserProfile(user));

    //Send initial progress measure
    SCORM_WRAPPER.updateProgressMeasure(this.props.tracking.progress_measure);

    //Init score
    var hasScore = (Object.keys(this.props.tracking.objectives).reduce(function(acc,key){ return acc + this.props.tracking.objectives[key].score;}.bind(this),0) > 0)
    if(hasScore){
      SCORM_WRAPPER.initScore();
    }
  }
  onUnload(event){
    if(SCORM_WRAPPER.isConnected()){
      SCORM_WRAPPER.onExit();
    }
  }
  render(){
    return (
      null
    );
  }
}