import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { BrowserRouter as Router, Route, Link,Switch } from "react-router-dom";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';

//Polyfills for IE
require('es6-promise').polyfill();
require('./Polyfill/index').startsWith();
require('./Polyfill/index').assign();

import App from './components/App';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import Feature from './components/Feature';
import RequiredAuth from './components/RequiredAuth';
import reducers from './reducers/index';
import Startup from './Startup';
const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);


ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}> 
    <Router>
      <Startup>
      <div>
          <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Signin">Signin</Link>
          </li>
          <li>
            <Link to="/Signup">Signup</Link>
          </li>
          <li>
            <Link to="/Feature">Feature</Link>
          </li>
        </ul>

        <hr />
        <Route exact path="/" component={App} />  
        <Route path="/Signin" component={Signin} />                                             
        <Route path="/Signup" component={Signup} />   
        <Route path="/Feature" component={RequiredAuth(Feature)} />
      </div>      
      </Startup>        
  </Router>
  </Provider>
  ,
  document.getElementById('root')
);

// Allow Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}