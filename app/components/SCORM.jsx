import React from 'react';

import SCORM_API from '../vendors/SCORM_API.js';

export default class SCORM extends React.Component {
  constructor(props){
    super(props);
    var scorm = new SCORM_API({debug: true, windowDebug: false, exit_type: ""});
    var connected = scorm.initialize();
    // console.log("SCORM connected: " + scorm.API.isActive);
    this.state = {scorm: scorm};
  }
  render(){
    return (
      null
    );
  }
}