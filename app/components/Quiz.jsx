import React from 'react';
import './../assets/scss/quiz.scss';

import * as Utils from '../vendors/Utils.js';
import {addObjectives, finishApp} from './../reducers/actions';

import MCQuestion from './MCQuestion.jsx';

export default class Quiz extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      current_question:1,
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
    let isLastQuestion = (this.state.current_question === this.props.quiz.questions.length);
    if(isLastQuestion === false){
      this.setState({current_question:(this.state.current_question + 1)});
    } else {
      this.props.dispatch(finishApp(true));
    }
  }
  render(){
    let question = this.props.quiz.questions[this.state.current_question - 1];
    let isLastQuestion = (this.state.current_question === this.props.quiz.questions.length);
    let objective = this.props.tracking.objectives["Question" + (this.state.current_question)];
    let onNextQuestion = this.onNextQuestion.bind(this);
    let questionRender = "";

    switch (question.type){
    case "multiple_choice":
      questionRender = (<MCQuestion question={question} dispatch={this.props.dispatch} I18n={this.props.I18n} objective={objective} onNextQuestion={onNextQuestion} isLastQuestion={isLastQuestion} quizCompleted={this.props.tracking.finished}/>);
      break;
    default:
      questionRender = "Question type not supported";
    }

    return (
      questionRender
    );
  }
}