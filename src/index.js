import * as ReactDOM from 'react-dom';
import * as React from 'react';

ReactDOM.render(
  <h1>Hello, World!!</h1>,
  document.getElementById('root')
);

// Allow Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}