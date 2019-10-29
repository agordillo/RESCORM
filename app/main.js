import React from 'react';
import ReactDOM from 'react-dom';
import ReduxProvider from './components/ReduxProvider';

const render = () => {
  ReactDOM.render(
    <ReduxProvider/>,
    document.getElementById('root')
  );
};

render(ReduxProvider);