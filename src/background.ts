import 'crx-hotreload'
import { sendMessage } from 'webext-bridge'

chrome.commands.onCommand.addListener(async (command) => {
  console.log(`Command: ${command}`)
  if (command === 'run-searcher') {
    // chrome.runtime.sendMessage('open-app')
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, 'open-app')
      }
    })
    // await sendMessage('open-app', {})
  }

  return true
})
