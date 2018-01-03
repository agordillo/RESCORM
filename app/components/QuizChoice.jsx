import React from 'react';

export default class QuizChoice extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    var quizClassName = "quiz_choice";
    var showCorrection = (this.props.quizAnswered);
    if(showCorrection){
      if(this.props.checked){
        if (this.props.choice.answer===true){
          quizClassName += " quiz_choice_correct";
        } else {
          quizClassName += " quiz_choice_incorrect";
        }
      } else {
        if (this.props.choice.answer===true){
          quizClassName += " quiz_choice_correct";
        }
      }
    }
    return (
      <div className={quizClassName}>
        <div className="quizC1">
          <input type="checkbox" checked={this.props.checked} onChange={() => this.props.handleChange(this.props.choice)} disabled={showCorrection}/>
        </div>
        <div className="quizC2">
          <p>{this.props.choice.value}</p>
        </div>
      </div>
    );
  }
}