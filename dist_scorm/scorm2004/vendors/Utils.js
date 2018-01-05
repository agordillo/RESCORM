var next_objective_id = 1;

export function objective(options){
  // Constructor
  var defaults = {
    id:                 next_objective_id,
    progress_measure:   0,
    score:              null,
    accomplished_score: null,
    accomplished:       false
  };
  var objective = Object.assign({}, defaults, options);

  objective.progress_measure = Math.max(0,Math.min(1,objective.progress_measure));
  
  if(typeof objective.score == "number"){
    objective.score = Math.max(0,Math.min(1,objective.score));
    if(typeof objective.accomplished_score == "number"){
      objective.accomplished_score = Math.min(objective.accomplished_score,objective.score);
    }
  }

  next_objective_id += 1;
  return objective;
}