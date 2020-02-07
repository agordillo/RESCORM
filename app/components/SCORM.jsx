import React from 'react';
import * as SCORM_WRAPPER from '../vendors/SCORM_API_Wrapper.js';
import {scormConnected, updateUserProfile} from './../reducers/actions';

let COMPLETION_THRESHOLD;
let COMPLETION_ATTEMPT_THRESHOLD;
let SCORE_THRESHOLD;

export default class SCORM extends React.Component {
  constructor(props){
    super(props);
    if(typeof props.config.scorm === "object"){
      if((typeof props.config.scorm.completion_threshold === "number") && (props.config.scorm.completion_threshold >= 0.0) && (props.config.scorm.completion_threshold <= 1.0)){
        COMPLETION_THRESHOLD = props.config.scorm.completion_threshold;
      }
      if((typeof props.config.scorm.completion_attempt_threshold === "number") && (props.config.scorm.completion_attempt_threshold >= 0.0) && (props.config.scorm.completion_attempt_threshold <= 1.0)){
        COMPLETION_ATTEMPT_THRESHOLD = props.config.completion_attempt_threshold;
      }
      if((typeof props.config.scorm.score_threshold === "number") && (props.config.scorm.score_threshold >= 0.0) && (props.config.scorm.score_threshold <= 1.0)){
        SCORE_THRESHOLD = props.config.scorm.score_threshold;
      }
    }
  }
  componentDidMount(){
    window.addEventListener("load", this.onLoad.bind(this));
    window.addEventListener("beforeunload", this.onUnload.bind(this));
  }
  componentWillUnmount(){
    window.removeEventListener("beforeunload", this.onUnload);
    window.removeEventListener("onload", this.onLoad);
  }
  componentDidUpdate(prevProps){
    if(SCORM_WRAPPER.isConnected()){
      let updateProgress = (prevProps.tracking.progress_measure !== this.props.tracking.progress_measure);
      if(updateProgress){
        SCORM_WRAPPER.updateProgressMeasure(this.props.tracking.progress_measure, COMPLETION_THRESHOLD, COMPLETION_ATTEMPT_THRESHOLD);
      }
      let updateScore = (prevProps.tracking.score !== this.props.tracking.score);
      if(updateScore){
        SCORM_WRAPPER.updateScore(this.props.tracking.score, SCORE_THRESHOLD);
      }
      if(updateProgress || updateScore){
        SCORM_WRAPPER.commit();
      }
    }
  }
  onLoad(){
    let scorm = new SCORM_WRAPPER.init(this.props.config.debug_scorm_api, this.props.config.debug_scorm_api_window);
    if(!SCORM_WRAPPER.isConnected()){
      this.props.dispatch(scormConnected(false));
      return;
    }
    this.props.dispatch(scormConnected(scorm));

    // Init user profile
    let user = SCORM_WRAPPER.getUserProfile();
    if((typeof user === "object") && (typeof user.learner_preference === "object")){
      if(typeof user.learner_preference.difficulty !== "undefined"){
        let difficulty = parseInt(user.learner_preference.difficulty, 10);
        if(!(isNaN(difficulty))){
          user.learner_preference.difficulty = difficulty;
        }
      }
    }
    this.props.dispatch(updateUserProfile(user));

    // Send initial progress measure
    SCORM_WRAPPER.updateProgressMeasure(this.props.tracking.progress_measure, COMPLETION_THRESHOLD, COMPLETION_ATTEMPT_THRESHOLD);

    // Init score
    let hasScore = (Object.keys(this.props.tracking.objectives).reduce(function(acc, key){ return acc + this.props.tracking.objectives[key].score;}.bind(this), 0) > 0);
    if(hasScore){
      SCORM_WRAPPER.initScore();
    }
  }
  onUnload(){
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