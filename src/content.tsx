import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

(() => {
  console.log('Launch');
  const app = document.createElement('div');
  app.id = 'chex-root';
  document.body.appendChild(app);

  ReactDOM.render(<App />, app);
})();
