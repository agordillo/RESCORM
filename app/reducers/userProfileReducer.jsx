function userProfileReducer(state = {}, action){
  switch (action.type){
  case 'UPDATE_USER_PROFILE':
    if(typeof action.user_profile.learner_preference !== "object"){
      action.user_profile.learner_preference = {};
    }
    return action.user_profile;
  default:
    return state;
  }
}

export default userProfileReducer;