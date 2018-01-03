function trackingReducer(state = {}, action) {
  let newState;
  switch (action.type) {
  case 'ADD_OBJECTIVES':
    newState = JSON.parse(JSON.stringify(state));
    for(let i=0; i<action.objectives.length; i++){
      if(typeof action.objectives[i].id != "undefined"){
        newState.objectives[action.objectives[i].id] = action.objectives[i];
      }
    }
    return newState;
  case 'OBJECTIVE_ACCOMPLISHED':
    if(typeof action.objective_id == "undefined"){
      return state; //Objective id not defined
    }
    let objective = state.objectives[action.objective_id];
    if(typeof objective == "undefined"){
      return state; //Objective not found
    }
    if(objective.accomplished != false){
      return state; //Objective has been already processed
    }

    newState = JSON.parse(JSON.stringify(state));
    objective = Object.assign({},objective);
    objective.accomplished = true;
 
    let updateProgress = (typeof objective.progress_measure == "number");
    if(updateProgress){
      objective.progress_measure = Math.max(0,Math.min(1,objective.progress_measure));
      newState.progress_measure = Math.max(0,Math.min(1,newState.progress_measure + objective.progress_measure));
    }

    let updateScore = ((typeof objective.score == "number")&&(typeof action.accomplished_score == "number"));
    if(updateScore){
      objective.accomplished_score = Math.max(0,Math.min(Math.max(0,Math.min(1,objective.score)),action.accomplished_score));
      newState.score = Math.max(0,Math.min(1,newState.score + objective.accomplished_score));
    }

    newState.objectives[action.objective_id] = objective;
    return newState;
  default:
    return state;
  }
}

export default trackingReducer;