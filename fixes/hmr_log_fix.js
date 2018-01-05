// Disable all logs for HMR (Hot Module Replacement) until the log level issue will be fixed (https://github.com/webpack/webpack/issues/4115)
//How to use: node fixes/hmr_log_fix.js

const {resolve} = require('path');

const replaceInFile = (filePath, searchRegex, replaceString) => {
  const fs = require('fs');
  filePath = resolve(filePath);

  fs.readFile(filePath, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    const result = data.replace(searchRegex, replaceString);

    fs.writeFile(filePath, result, 'utf8', function (err) {
      if (err) {
        return console.log(err);
      }
    });
  });
};

const emptyStatement = '//$1';
const consoleRegex = /(console\.(info|log|warn|error).+\);)/g;
replaceInFile("node_modules/webpack/hot/log.js", consoleRegex, emptyStatement);