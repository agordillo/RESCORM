import React from 'react';
import './../assets/scss/quiz.scss';

import * as Utils from '../vendors/Utils.js';
import {addObjectives, resetObjectives, finishApp} from './../reducers/actions';

import QuizHeader from './QuizHeader.jsx';
import MCQuestion from './MCQuestion.jsx';

export default class Quiz extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      current_question_index:1,
    };
  }
  componentDidMount(){
    // Create objectives (One per question included in the quiz)
    let objectives = [];
    let nQuestions = this.props.quiz.questions.length;
    for(let i = 0; i < nQuestions; i++){
      objectives.push(new Utils.Objective({id:("Question" + (i + 1)), progress_measure:(1 / nQuestions), score:(1 / nQuestions)}));
    }
    this.props.dispatch(addObjectives(objectives));
  }
  onNextQuestion(){
    let isLastQuestion = (this.state.current_question_index === this.props.quiz.questions.length);
    if(isLastQuestion === false){
      this.setState({current_question_index:(this.state.current_question_index + 1)});
    } else {
      this.props.dispatch(finishApp(true));
    }
  }
  onResetQuiz(){
    this.setState({current_question_index:1});
    this.props.dispatch(resetObjectives());
  }
  render(){
    let currentQuestion = this.props.quiz.questions[this.state.current_question_index - 1];
    let isLastQuestion = (this.state.current_question_index === this.props.quiz.questions.length);
    
    let objective = this.props.tracking.objectives["Question" + (this.state.current_question_index)];
    let onNextQuestion = this.onNextQuestion.bind(this);
    let onResetQuiz = this.onResetQuiz.bind(this);
    let currentQuestionRender = "";

    switch (currentQuestion.type){
    case "multiple_choice":
      currentQuestionRender = (<MCQuestion question={currentQuestion} dispatch={this.props.dispatch} I18n={this.props.I18n} objective={objective} onNextQuestion={onNextQuestion} onResetQuiz={onResetQuiz} isLastQuestion={isLastQuestion} quizCompleted={this.props.tracking.finished}/>);
      break;
    default:
      currentQuestionRender = "Question type not supported";
    }

    return (
      <div className="quiz">
        <QuizHeader I18n={this.props.I18n} quiz={this.props.quiz} currentQuestionIndex={this.state.current_question_index}/>
        {currentQuestionRender}
      </div>
    );
  }
}