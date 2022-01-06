import 'crx-hotreload'
import Browser from 'webextension-polyfill'

chrome.commands.onCommand.addListener(async (command) => {
  console.log(`Command: ${command}`)

  if (command === 'run-searcher') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0]
      if (tab?.id) {
        const [histories, tabs] = await Promise.all([
          Browser.history?.search({ maxResults: 10000, text: '' }),
          Browser.tabs?.query({ active: true, currentWindow: true }),
        ])

        const message = {
          histories: histories,
          tabs: tabs,
          task: 'open-app',
        }
        chrome.tabs.sendMessage(tab.id, JSON.stringify(message))
      }
    })
  }

  return true
})
