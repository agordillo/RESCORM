import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import {AppContainer} from 'react-hot-loader';

import {INITIAL_STATE} from '../constants/constants';
import GlobalState from './../reducers/reducers';
import App from './App';

export default class ReduxProvider extends React.Component {
  constructor(props){
    super(props);
    this.initialState = INITIAL_STATE;
    this.store = this.configureStore();
  }
  configureStore(){
    const store = createStore(GlobalState, this.initialState);
    if(module.hot){
      module.hot.accept('./../reducers/reducers', () => {
        const nextRootReducer = require('./../reducers/reducers').default;
        store.replaceReducer(nextRootReducer);
      });
    }
    return store;
  }
  render(){
    return (
            <AppContainer>
                <Provider store={this.store}>
                    <div style={{height:'100%'}}>
                        <App store={this.store}/>
                    </div>
                </Provider>
            </AppContainer>
    );
  }
}