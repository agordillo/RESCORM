import * as SCORM_WRAPPER from '../vendors/SCORM_API_Wrapper.js';

function trackingReducer(state = {}, action) {
  switch (action.type) {
  case 'OBJECTIVE_ACCOMPLISHED':
    let objective =  action.objective;
    if((typeof objective == "undefined")||(typeof objective.id == "undefined")){
      return state; //Objective id not defined
    }
    if(state.objectives.map(function(el){return el.id}).indexOf(objective.id)!=-1){
      return state; //Objective has been already processed
    }
    
    let newState = JSON.parse(JSON.stringify(state));
    
    let updateProgress = (typeof objective.progress_measure == "number");
    if(updateProgress){
      objective.progress_measure = Math.max(0,Math.min(1,objective.progress_measure));
      newState.progress_measure = Math.max(0,Math.min(1,newState.progress_measure + objective.progress_measure));
    }

    let updateScore = (typeof objective.score == "number");
    if(updateScore){
      objective.score = Math.max(0,Math.min(1,objective.score));
      newState.score = Math.max(0,Math.min(1,newState.score + objective.score));
    }

    newState.objectives.push(objective);

    if(SCORM_WRAPPER.isConnected()){
      if(updateProgress){
        SCORM_WRAPPER.updateProgressMeasure(newState.progress_measure);
      }
      if(updateScore){
        SCORM_WRAPPER.updateScore(newState.score);
      }
      if(updateProgress||updateScore){
        SCORM_WRAPPER.commit();
      }
    }

    return newState;
  default:
    return state;
  }
}

export default trackingReducer;