import React from 'react';
import ReactDOM from 'react-dom';

import { SearchBox } from './page/SearchBox';

(() => {
  // // const [open, setOpen] = useState(false)

  // // onMessage('open-app', async ({ data }) => {
  // //   console.log('open!!!!!!!!!!!!!!')
  // // })

  // chrome.runtime.onMessage.addListener(
  //   async (message, sender, sendResponse) => {
  //     return true
  //   }
  // )

  console.log('Launch');
  const app = document.createElement('div');
  app.id = 'chex-root';
  document.body.appendChild(app);

  ReactDOM.render(
    <div>
      <SearchBox />
    </div>,
    app,
  );
})();
