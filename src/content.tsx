import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

(() => {
  console.log('Launch');
  const app = document.createElement('div');
  app.id = 'chex-root';
  // appendChildだとestablisconnection errorがでるので先頭にいれる
  // TODO: パフォーマンス影響調査
  document.body.prepend(app);

  ReactDOM.render(<App />, app);
})();
