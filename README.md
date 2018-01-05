# SCORM Application React Boilerplate

## Installation

1. Previous requirements
    * A computer with:
      * Ubuntu 14.04+
      * Internet connection 
2. Install [node.js](https://nodejs.org/es/download/) and [git](https://git-scm.com/downloads).
3. Open a new terminal, go to your working directory and clone this GitHub poject:
    ```bash
    git clone https://github.com/agordillo/scormapp-react-boilerplate
    ```
4. Go to the 'scormapp-react-boilerplate' folder that has been created.
5. Execute the following command to install all the project dependencies in the 'node_modules' folder:
    ```bash
    npm install
    ```
6. Execute the following command to disable all logs for HMR (Hot Module Replacement):
    ```bash
    node fixes/hmr_log_fix.js
    ```
7. Execute the following command to start the development server:
    ```bash
    npm start
    ```
    The app will be available at the following URL [http://localhost:8080](http://localhost:8080).  
    SCORM 1.2 environment will be available at [http://localhost:8080/scorm12.html](http://localhost:8080/scorm12.html).  
    SCORM 2004 environment will be available at [http://localhost:8080/scorm2004.html](http://localhost:8080/scorm2004.html).
8. Development server can be stopped by pressing 'Ctrl-C'.
9. Configuration can be specified in the following files:  
    * app/config/config.js: Global configuration for the React application.  
    * app/config/config_lms.js: Configuration for the SCORM environments.  

## Available commands

- 'npm start' - Start the development server.
- 'npm run production' - Create a production ready build of the application in the 'dist' folder.
- 'npm run clean' - Remove the 'dist' folder.
- 'npm run lint' - execute an eslint check.
- 'npm test' - run all tests.

# Features

- [x] ECMAScript 6 and JSX support
- [x] React 16.0.0
- [x] React Router v4
- [x] Redux
- [x] SCORM 1.2 and SCORM 2004 4th Editon support
- [x] Webpack (v.3.6.0) and Webpack Dev Server (v.2.8.2)
- [x] Hot Module Replacement using [react-hot-loader](https://github.com/gaearon/react-hot-loader)
- [x] Component testing using [Enzyme](https://github.com/airbnb/enzyme) and [Jest](https://facebook.github.io/jest)
- [x] ES6 linting with continuous linting on file change
- [x] Separate CSS stylesheets generation
- [x] SASS support
- [x] Export Separate Vendor Files

# License

This boilerplate has been developed based on [ES6 React boilerplate using Webpack](https://github.com/KleoPetroff/react-webpack-boilerplate) and [react-iweb-boilerplate](https://github.com/sonsoleslp/react-iweb-boilerplate).

scormapp-react-boilerplate is available under MIT License.
