import React from 'react';
import './../assets/scss/quiz.scss';

import * as Utils from '../vendors/Utils.js';
import {addObjectives, resetObjectives, finishApp} from './../reducers/actions';

import QuizHeader from './QuizHeader.jsx';
import MCQuestion from './MCQuestion.jsx';

export default class Quiz extends React.Component {
  constructor(props){
    super(props);
    let quiz = this.props.quiz;
    let questions = quiz.questions;

    // Adaptive behaviour
    // Sort questions based on difficulty
    let adaptive_sorted = false;
    if((this.props.config.adaptive === true) && (typeof props.user_profile === "object") && (typeof props.user_profile.learner_preference === "object") && (typeof props.user_profile.learner_preference.difficulty === "number")){
      let difficulty = props.user_profile.learner_preference.difficulty;
      if((difficulty >= 0) && (difficulty <= 10)){
        for(let i = 0; i < questions.length; i++){
          if((typeof questions[i].difficulty !== "number") || (questions[i].difficulty < 0) || (questions[i].difficulty > 10)){
            questions[i].difficulty = 5;
          }
          questions[i].suitability = (10 - Math.abs((questions[i].difficulty - difficulty))) / 10;
        }
        questions.sort(function(a, b){ return b.suitability - a.suitability; });
        adaptive_sorted = true;
      }
    }

    if(adaptive_sorted === false){
      questions = Utils.shuffleArray(questions);
    }

    if((typeof this.props.config.n === "number") && (this.props.config.n >= 1)){
      // Limit number of questions
      questions = questions.slice(0, Math.min(this.props.config.n, questions.length));
    }

    quiz.questions = questions;

    this.state = {
      quiz:quiz,
      current_question_index:1,
    };
  }
  componentDidMount(){
    // Create objectives (One per question included in the quiz)
    let objectives = [];
    let nQuestions = this.state.quiz.questions.length;
    for(let i = 0; i < nQuestions; i++){
      objectives.push(new Utils.Objective({id:("Question" + (i + 1)), progress_measure:(1 / nQuestions), score:(1 / nQuestions)}));
    }
    this.props.dispatch(addObjectives(objectives));
  }
  onNextQuestion(){
    let isLastQuestion = (this.state.current_question_index === this.state.quiz.questions.length);
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
    let currentQuestion = this.state.quiz.questions[this.state.current_question_index - 1];
    let isLastQuestion = (this.state.current_question_index === this.state.quiz.questions.length);

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
        <QuizHeader I18n={this.props.I18n} quiz={this.state.quiz} currentQuestionIndex={this.state.current_question_index}/>
        {currentQuestionRender}
      </div>
    );
  }
}