import React from 'react';

export default class Header extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    var loggedText;
    var trackingTexts = [];

    if(typeof this.props.tracking.progress_measure == "number"){
      trackingTexts.push("Progress Measure: " + (this.props.tracking.progress_measure*100) + "%");
    } else {
      trackingTexts.push("Progress Measure: null");
    }
    if(typeof this.props.tracking.score == "number"){
      trackingTexts.push("Score: " + (this.props.tracking.score*100) + "%");
    } else {
      trackingTexts.push("Score: null");
    }
    if(this.props.user_profile){
      if((typeof this.props.user_profile.name == "string")){
        loggedText = ("Logged as " + this.props.user_profile.name);
      }
      if(typeof this.props.user_profile.learner_preference == "object"){
        if(typeof this.props.user_profile.learner_preference.difficulty == "number"){
          trackingTexts.push("Difficulty: " + this.props.user_profile.learner_preference.difficulty);
        }
      }
    }

    var loggedEl = null;
    if(typeof loggedText == "string"){
      loggedEl = <p id="logged_user">{loggedText}</p>
    }
    var trackingEls = trackingTexts.map(function(text,index){
      return <span key={index}>{text}</span>
    });

    return (
      <div>
        <h1 id="heading">SCORM Application React Boilerplate</h1>
        <p id="tracking">{trackingEls}</p>
        {loggedEl}
      </div>
    );
  }
}