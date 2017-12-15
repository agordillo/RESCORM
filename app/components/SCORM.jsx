import React from 'react';
import SCORM_API from '../vendors/SCORM_API.js';

//Constants
const hasScore = true;
const COMPLETION_THRESHOLD = 0; //Force attempt completion
const COMPLETION_ATTEMPT_THRESHOLD = 0;
const SCORE_THRESHOLD = 0.5;

export default class SCORM extends React.Component {
  constructor(props){
    super(props);
    this.state = {scorm: undefined, progressMeasure: 0, score: undefined, objectives: []};
  }
  componentWillMount(){
    var scorm = new SCORM_API({debug: true, windowDebug: false, exit_type: ""});
    var connected = scorm.initialize();
    scorm.debug("Connected: " + scorm.API.isActive,4);
    this.setState({scorm: scorm});
  }
  componentDidMount(){
    if(!this.state.scorm.API.isActive){
      return;
    }

    //Init User model
    var user = {};
    user.name = this.state.scorm.getvalue('cmi.learner_name');
    user.id = this.state.scorm.getvalue('cmi.learner_id');
    this.props.setAppState({user: user});

    //Send initial progress measure
    this._updateProgressMeasure(0);

    //Init score
    if(hasScore){
      this.state.scorm.setvalue('cmi.score.min',(0).toString());
      this.state.scorm.setvalue('cmi.score.max',(100).toString());
      this.setState({score: 0});
    }
  }
  _isConnected(){
    return ((typeof this.state.scorm != "undefined")&&(typeof this.state.scorm.API != "undefined")&&(this.state.scorm.API.isActive))
  }
 /*
  * ProgressMeasure should be a number on a [0,1] scale.
  */
  _updateProgressMeasure(progressMeasure){
    if(typeof progressMeasure == "number"){
      progressMeasure = Math.max(0,Math.min(1,progressMeasure));
      this.state.scorm.setvalue('cmi.progress_measure',progressMeasure.toString());
      this._updateCompletionStatus(progressMeasure);
    }
  }
  _updateCompletionStatus(progressMeasure){
    if(typeof progressMeasure != "number"){
      progressMeasure = 0;
    }
    var completionStatus;
    if(progressMeasure >= COMPLETION_THRESHOLD){
      completionStatus = "completed";
    } else if (progressMeasure>=COMPLETION_ATTEMPT_THRESHOLD){
      completionStatus = "incomplete";
    } else {
      completionStatus = "not attempted";
    }
    this.state.scorm.setvalue('cmi.completion_status',completionStatus);
  }
 /*
  * Score should be a number on a [0,1] scale.
  */
  _updateScore(score){
    if(typeof score == "number"){
      score = Math.max(0,Math.min(1,score));
      this.state.scorm.setvalue('cmi.score.scaled',score.toString());
      this.state.scorm.setvalue('cmi.score.raw',(score*100).toString());
      this._updateSuccessStatus(score);
    }
  }
  _updateSuccessStatus(score){
    var successStatus;
    if(typeof score != "number"){
      successStatus = "unknown";
    } else if(score >= SCORE_THRESHOLD){
      successStatus = "passed";
    } else {
      successStatus = "failed";
    }
    this.state.scorm.setvalue('cmi.success_status',successStatus);
  }
  _onExit(){
    _updateProgressMeasure(this.state.progressMeasure);
    // scorm.commit(); terminate will call commit
    scorm.terminate();
  }
 /*
  * _onObjectiveAccomplished({id: 1, progressMeasure: 50, score: 10});
  */
  onObjectiveAccomplished(objective){
    if((typeof objective == "undefined")||(typeof objective.id == "undefined")){
      return; //objective not defined
    }
    if(this.state.objectives.indexOf(objective.id)!=-1){
      return; //Objective has been already processed
    }
    this.state.objectives.push(objective.id);

    var updateProgress = (typeof objective.progressMeasure == "number");
    var updateScore = (typeof objective.score == "number");

    if(updateProgress){
      objective.progressMeasure = Math.max(0,Math.min(1,objective.progressMeasure));
      this._updateProgressMeasure(this.state.progressMeasure + objective.progressMeasure);
    }
    if(updateScore){
      objective.score = Math.max(0,Math.min(1,objective.score));
      this._updateScore(this.state.score + objective.score);
    }
    if(updateProgress||updateScore){
      this.state.scorm.commit();
    }
  }

  render(){
    return (
      null
    );
  }
}