import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { onMessage } from 'webext-bridge'
import { App } from './Main'
import { SearchBox } from './page/SearchBox'
;(() => {
  // const [open, setOpen] = useState(false)

  // onMessage('open-app', async ({ data }) => {
  //   console.log('open!!!!!!!!!!!!!!')
  // })

  chrome.runtime.onMessage.addListener((request) => {
    console.log('onnnnn2', request)
    chrome.runtime.sendMessage('open-app')
    return true
  })

  console.log('Launch')
  const app = document.createElement('div')
  app.id = 'chex-root'
  document.body.appendChild(app)

  ReactDOM.render(
    <div>
      {'tamuken'}
      <SearchBox />
    </div>,
    app
  )
})()
