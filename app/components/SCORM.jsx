import React from 'react';
import * as SCORM_WRAPPER from '../vendors/SCORM_API_Wrapper.js';
import { scormConnected, updateUserProfile, objectiveAccomplished } from './../reducers/actions';

export default class SCORM extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    window.addEventListener("load", this.onLoad.bind(this));
    window.addEventListener("beforeunload", this.onUnload.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onUnload);
    window.removeEventListener("onload", this.onLoad);
  }
  onLoad(event){
    var scorm = new SCORM_WRAPPER.init(true);
    if(!SCORM_WRAPPER.isConnected()){
      return;
    }
    this.props.dispatch(scormConnected(scorm));
    
    //Init user profile
    var user = SCORM_WRAPPER.getUserProfile();
    this.props.dispatch(updateUserProfile(user));

    //Send initial progress measure
    SCORM_WRAPPER.updateProgressMeasure(this.props.tracking.progress_measure);

    //Init score
    var hasScore = true; //TODO: get from config
    if(hasScore){
      SCORM_WRAPPER.initScore();
    }

    //Testing
    // this.props.dispatch(objectiveAccomplished({id:1,score:0.4,progress_measure:0.5}));
  }
  onUnload(event){
    if(SCORM_WRAPPER.isConnected()){
      SCORM_WRAPPER.onExit(this.props.tracking.progress_measure);
    }
  }
  render(){
    return (
      null
    );
  }
}