export function scormConnected(scorm){
  return{
    type: 'SCORM_CONNECTED',
    scorm: scorm
  };
}

export function updateUserProfile(user_profile){
  return{
    type: 'UPDATE_USER_PROFILE',
    user_profile: user_profile
  };
}

export function objectiveAccomplished(objective){
  return{
    type: 'OBJECTIVE_ACCOMPLISHED',
    objective: objective
  };
}