import * as Utils from '../vendors/Utils.js';

function trackingReducer(state = {}, action){
  let newState;
  switch (action.type){
  case 'ADD_OBJECTIVES':{
    newState = JSON.parse(JSON.stringify(state));
    for(let i = 0; i < action.objectives.length; i++){
      if(typeof action.objectives[i].id !== "undefined"){
        newState.objectives[action.objectives[i].id] = action.objectives[i];
      }
    }
    return newState;}
  case 'OBJECTIVE_ACCOMPLISHED':{
    if(typeof action.objective_id === "undefined"){
      return state; // Objective id not defined
    }
    let objective = state.objectives[action.objective_id];
    if(typeof objective === "undefined"){
      return state; // Objective not found
    }

    let updateProgress = (typeof objective.progress_measure === "number");
    if(updateProgress){
      objective.progress_measure = Math.max(0, Math.min(1, objective.progress_measure));
    }

    let updateScore = ((typeof objective.score === "number") && (typeof action.accomplished_score === "number"));
    if(updateScore){
      objective.accomplished_score = Math.max(0, Math.min(Math.max(0, Math.min(1, objective.score)), action.accomplished_score));
    }

    objective.accomplished = true;

    newState = JSON.parse(JSON.stringify(state));
    objective = Object.assign({}, objective);
    newState.objectives[action.objective_id] = objective;

    // Calculate overall progress measure and score
    newState.progress_measure = 0;
    newState.score = 0;
    let objectivesIds = Object.keys(newState.objectives);
    for(let i = 0; i < objectivesIds.length; i++){
      if(newState.objectives[objectivesIds[i]].accomplished === true){
        if(typeof newState.objectives[objectivesIds[i]].progress_measure === "number"){
          newState.progress_measure += newState.objectives[objectivesIds[i]].progress_measure;
        }
        if(typeof newState.objectives[objectivesIds[i]].accomplished_score === "number"){
          newState.score += newState.objectives[objectivesIds[i]].accomplished_score;
        }
      }
    }

    return newState;
  }
  case 'RESET_OBJECTIVES':{
    newState = JSON.parse(JSON.stringify(state));
    newState.objectives = {};
    newState.progress_measure = 0;
    newState.score = 0;
    let objectiveKeys = Object.keys(state.objectives);
    for(let i = 0; i < objectiveKeys.length; i++){
      let _objective = state.objectives[objectiveKeys[i]];
      _objective = Utils.ResetObjective(_objective);
      newState.objectives[objectiveKeys[i]] = _objective;
    }
    return newState;}
  case 'FINISH_APP':{
    newState = JSON.parse(JSON.stringify(state));
    if([true, false].indexOf(action.finished) !== -1){
      newState.finished = action.finished;
    }
    return newState;}
  default:
    return state;
  }
}

export default trackingReducer;