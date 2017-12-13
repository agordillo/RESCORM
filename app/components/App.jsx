import React from 'react';
import './../assets/scss/main.scss';

import SCORM from './SCORM.jsx';

export default class App extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <SCORM/>
        <h2 id="heading">Hello ReactJS</h2>
      </div>
    );
  }
}