function waitForUserProfileReducer(state = false, action){
  switch (action.type){
  case 'SCORM_CONNECTED':
    if(action.scorm === false){
      return false;
    }
    return state;
  case 'UPDATE_USER_PROFILE':
    return false;
  default:
    return state;
  }
}

export default waitForUserProfileReducer;