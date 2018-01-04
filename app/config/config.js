export const GLOBAL_CONFIG = {
  debug: false,
  debug_scorm_api: true,
  debug_scorm_api_window: true
}

var processConfig = function(){
  GLOBAL_CONFIG.debug_scorm_api = ((GLOBAL_CONFIG.debug)&&(GLOBAL_CONFIG.debug_scorm_api));
  GLOBAL_CONFIG.debug_scorm_api_window = ((GLOBAL_CONFIG.debug_scorm_api)&&(GLOBAL_CONFIG.debug_scorm_api_window));
}();