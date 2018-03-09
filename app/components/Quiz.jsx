import React from 'react';
import './../assets/scss/quiz.scss';

import * as Utils from '../vendors/Utils.js';
import {addObjectives} from './../reducers/actions';

import MCQuestion from './MCQuestion.jsx';

export default class Quiz extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      current_question:1,
      completed:false,
    };
  }
  componentDidMount(){
    // Create objectives (One per question included in the quiz)
    let objectives = [];
    let nQuestions = this.props.quiz.questions.length;
    for(let i = 0; i < nQuestions; i++){
      objectives.push(new Utils.objective({id:("Question" + (i + 1)), progress_measure:(1 / nQuestions), score:(1 / nQuestions)}));
    }
    this.props.dispatch(addObjectives(objectives));
  }
  onNextQuestion(){
    let lastQuestion = (this.state.current_question === this.props.quiz.questions.length);
    if(lastQuestion === false){
      this.setState({current_question:(this.state.current_question + 1)});
    } else {
      this.setState({completed:true});
      alert("Quiz finished");
    }
  }
  render(){
    let question = this.props.quiz.questions[this.state.current_question - 1];
    let objective = this.props.tracking.objectives["Question" + (this.state.current_question)];
    let onNextQuestion = this.onNextQuestion.bind(this);
    let questionRender = "";

    switch (question.type){
    case "multiple_choice":
      questionRender = (<MCQuestion question={question} dispatch={this.props.dispatch} I18n={this.props.I18n} objective={objective} onNextQuestion={onNextQuestion} quizCompleted={this.state.completed}/>);
      break;
    default:
      questionRender = "Question type not supported";
    }

    return (
      questionRender
    );
  }
}