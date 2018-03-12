import React from 'react';

export default class QuizHeader extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className="quizHeader">
        <p>{this.props.I18n.getTrans("i.quiz_header_title", {current:this.props.currentQuestionIndex, total:this.props.quiz.questions.length})}</p>
      </div>
    );
  }
}