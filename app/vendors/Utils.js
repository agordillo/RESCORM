let next_objective_id = 1;

export function objective(options){
  // Constructor
  let defaults = {
    id:next_objective_id,
    progress_measure:0,
    score:null,
    accomplished_score:null,
    accomplished:false,
  };
  let _objective = Object.assign({}, defaults, options);

  _objective.progress_measure = Math.max(0, Math.min(1, _objective.progress_measure));

  if(typeof _objective.score === "number"){
    _objective.score = Math.max(0, Math.min(1, _objective.score));
    if(typeof _objective.accomplished_score === "number"){
      _objective.accomplished_score = Math.min(_objective.accomplished_score, _objective.score);
    }
  }

  next_objective_id += 1;
  return _objective;
}