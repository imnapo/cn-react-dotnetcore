import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Signup from './components/auth/Signup';
import reducers from './reducers/index';
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);


ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>        
    <Signup />
  </Provider>
  ,
  document.getElementById('root')
);

// Allow Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}