import React from 'react';
import { connect } from 'react-redux';
import './../assets/scss/main.scss';

import SCORM from './SCORM.jsx';
import Header from './Header.jsx';
import Quiz from './Quiz.jsx';

class App extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <SCORM dispatch={this.props.dispatch} tracking={this.props.tracking} scorm={this.props.scorm}/>
        <Header user_profile={this.props.user_profile}/>
        <Quiz/>
      </div>
    );
  }
}

function mapStateToProps(state){
  return state;
}

export default connect(mapStateToProps)(App);