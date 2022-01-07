import 'crx-hotreload';
import Browser from 'webextension-polyfill';

import { MessageTasks } from './util/constant';

const uniqueArray = <T extends any>(array: T[], key: keyof T) =>
  Array.from(new Map(array.map((o) => [o[key], o])).values());

const createFavicon = (url?: string) =>
  url ? `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}` : '';

chrome.commands.onCommand.addListener(async (command) => {
  console.log(`Command: ${command}`);

  if (command === 'run-searcher') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      if (tab?.id) {
        const [histories, tabs] = await Promise.all([
          Browser.history?.search({ maxResults: 10000, text: '' }),
          Browser.tabs?.query({}),
        ]);

        const message = {
          histories: uniqueArray(
            histories.map((history) => ({
              id: history.id,
              url: history.url,
              title: history.title,
              faviconUrl: createFavicon(history.url),
              visitCount: history.visitCount,
              type: 'history',
            })),
            'url',
          ),
          tabs: uniqueArray(
            tabs.map((tab) => ({
              id: String(tab.id), // TabはIdがNumber
              url: tab.url,
              title: tab.title,
              faviconUrl: createFavicon(tab.url),
              type: 'tab',
            })),
            'url',
          ),
          task: MessageTasks.openApp,
        };
        chrome.tabs.sendMessage(tab.id, JSON.stringify(message));
      }
    });
  }

  return true;
});

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.task === MessageTasks.changeTab) {
    const tabId = request.tabId;
    chrome.tabs.update(tabId, { active: true });
  }
});
