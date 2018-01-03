import React from 'react';

export default class Header extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    var loggedEl = null;
    var loggedText;
    if((this.props.user_profile)&&(typeof this.props.user_profile.name == "string")){
      loggedText = ("Logged as " + this.props.user_profile.name);
    }
    if(typeof loggedText == "string"){
      loggedEl = <p id="logged_user">{loggedText}</p>
    }
    return (
      <div>
        <h1 id="heading">SCORM Application React Boilerplate</h1>
        <p id="tracking">Progress Measure: {this.props.tracking.progress_measure*100}% &nbsp;&nbsp;&nbsp; Score: {this.props.tracking.score*100}%</p>
        {loggedEl}
      </div>
    );
  }
}