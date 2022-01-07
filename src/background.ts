import 'crx-hotreload';
import Browser from 'webextension-polyfill';

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
          Browser.tabs?.query({ active: true, currentWindow: true }),
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
              id: tab.id,
              url: tab.url,
              title: tab.title,
              faviconUrl: createFavicon(tab.url),
              type: 'tab',
            })),
            'url',
          ),
          task: 'open-app',
        };
        chrome.tabs.sendMessage(tab.id, JSON.stringify(message));
      }
    });
  }

  return true;
});
