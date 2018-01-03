import React from 'react';

import * as Utils from '../vendors/Utils.js';
import { addObjectives, objectiveAccomplished } from './../reducers/actions';

import SCORM from './SCORM.jsx';

export default class Quiz extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    //Create objectives
    var objective = new Utils.objective({id:"MyQuiz",progress_measure:1,score:1});
    this.props.dispatch(addObjectives([objective]));

    //Testing
    setTimeout(function(){
      var objective = this.props.tracking.objectives["MyQuiz"];
      this.props.dispatch(objectiveAccomplished(objective.id,objective.score*0.5));
      setTimeout(function(){
        console.log("Final tracking")
        console.log(this.props.tracking);
      }.bind(this),1000);
    }.bind(this),4000);
  }
  render(){
    return (
      <div>
        Quiz
      </div>
    );
  }
}