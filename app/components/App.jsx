import React from 'react';
import {connect} from 'react-redux';
import './../assets/scss/main.scss';

import {GLOBAL_CONFIG} from '../config/config.js';
import * as I18n from '../vendors/I18n.js';
import * as SAMPLES from '../config/samples.js';

import SCORM from './SCORM.jsx';
import Header from './Header.jsx';
import Quiz from './Quiz.jsx';

export class App extends React.Component {
  constructor(props){
    super(props);
    I18n.init();
  }
  render(){
    return (
      <div id="container">
        <SCORM dispatch={this.props.dispatch} tracking={this.props.tracking} config={GLOBAL_CONFIG}/>
        <Header user_profile={this.props.user_profile} tracking={this.props.tracking} config={GLOBAL_CONFIG} I18n={I18n}/>
        <Quiz dispatch={this.props.dispatch} tracking={this.props.tracking} quiz={SAMPLES.question_example} config={GLOBAL_CONFIG} I18n={I18n}/>
      </div>
    );
  }
}

function mapStateToProps(state){
  return state;
}

export default connect(mapStateToProps)(App);