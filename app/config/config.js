export const GLOBAL_CONFIG = {
  debug:true,
  debug_scorm_api:true,
  debug_scorm_api_window:false,
};

let processConfig = (function(){
  GLOBAL_CONFIG.debug_scorm_api = ((GLOBAL_CONFIG.debug) && (GLOBAL_CONFIG.debug_scorm_api));
  GLOBAL_CONFIG.debug_scorm_api_window = ((GLOBAL_CONFIG.debug_scorm_api) && (GLOBAL_CONFIG.debug_scorm_api_window));
})();