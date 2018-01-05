console.log("Init task: Generate SCORM packages");

const {resolve} = require('path');
const fs = require('fs-extra');
const zipFolder = require('zip-folder');

const path = resolve(__dirname, '../dist_scorm');
const scorm12_path = resolve(__dirname, '../dist_scorm/scorm12');
const scorm2004_path = resolve(__dirname, '../dist_scorm/scorm2004');

const paths = [path, scorm12_path, scorm2004_path];
for(let i = 0; i < paths.length; i++){
  if(!fs.existsSync(paths[i])){
    fs.mkdirSync(paths[i]);
  }
}

// Copy APP files
const app_path = resolve(__dirname, '../dist');
fs.copySync(app_path, scorm12_path);
fs.copySync(app_path, scorm2004_path);

// Copy SCORM files

// SCORM 1.2
const scorm12_schemas_path = resolve(__dirname, '../app/scorm/schemas/SCORM_12');
fs.readdirSync(scorm12_schemas_path).forEach(file => {
  fs.copySync(scorm12_schemas_path + "/" + file, scorm12_path + "/" + file);
});
fs.copySync(resolve(__dirname, '../app/scorm/imsmanifest_scorm12.xml'), scorm12_path + "/imsmanifest.xml");

// SCORM 2004
const scorm2004_schemas_path = resolve(__dirname, '../app/scorm/schemas/SCORM_2004');
fs.readdirSync(scorm2004_schemas_path).forEach(file => {
  fs.copySync(scorm2004_schemas_path + "/" + file, scorm2004_path + "/" + file);
});
fs.copySync(resolve(__dirname, '../app/scorm/imsmanifest_scorm2004.xml'), scorm2004_path + "/imsmanifest.xml");

// Generate SCORM packages

let nFilesGenerated = 0;
let success = true;
function _onZipFileGenerated(fileSuccess){
  nFilesGenerated++;
  success = (success && fileSuccess);
  if(nFilesGenerated === 2){
    console.log("Task finished");
  }
}

zipFolder(scorm12_path, path + "/scorm12.zip", function(err){
  return _onZipFileGenerated(typeof err === "undefined");
});

zipFolder(scorm2004_path, path + "/scorm2004.zip", function(err){
  return _onZipFileGenerated(typeof err === "undefined");
});