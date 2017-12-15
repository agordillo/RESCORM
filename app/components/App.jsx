import React from 'react';
import './../assets/scss/main.scss';

import SCORM from './SCORM.jsx';
import Quiz from './Quiz.jsx';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {user: {name: "Unknown"}};
  }
  render(){
    return (
      <div>
        <SCORM
        setAppState={(newState) => this.setState(newState)}
        />
        <h2 id="heading">Hello {this.state.user.name}</h2>
        <Quiz/>
      </div>
    );
  }
}