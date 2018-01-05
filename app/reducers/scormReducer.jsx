function scormReducer(state = null, action){
  switch (action.type){
  case 'SCORM_CONNECTED':
    return action.scorm;
  default:
    return state;
  }
}

export default scormReducer;