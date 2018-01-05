function userProfileReducer(state = {}, action){
  switch (action.type){
  case 'UPDATE_USER_PROFILE':
    return action.user_profile;
  default:
    return state;
  }
}

export default userProfileReducer;