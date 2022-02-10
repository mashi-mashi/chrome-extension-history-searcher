import 'crx-hotreload';
import Browser from 'webextension-polyfill';

import { ManifestCommands, MessageTasks } from './util/constant';

const uniqueArray = <T extends any>(array: T[], key: keyof T) =>
  Array.from(new Map(array.map((o) => [o[key], o])).values());

const createFavicon = (url?: string) =>
  url ? `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}` : '';

Browser.commands.onCommand.addListener(async (command) => {
  console.log(`Command: ${command}`);

  if (command === 'run-searcher') {
    const tabs = await Browser.tabs.query({ active: true, currentWindow: true });

    const tab = tabs[0];
    if (tab?.id) {
      const [histories, tabs] = await Promise.all([
        Browser.history?.search({ maxResults: 10000, text: '' }),
        Browser.tabs?.query({})
      ]);

      const message = {
        histories: uniqueArray(
          histories.map((history) => ({
            id: history.id,
            url: history.url,
            title: history.title,
            faviconUrl: createFavicon(history.url),
            visitCount: history.visitCount,
            type: 'history'
          })),
          'url'
        ),
        tabs: uniqueArray(
          tabs.map((tab) => ({
            id: String(tab.id), // TabはIdがNumber
            url: tab.url,
            title: tab.title,
            faviconUrl: createFavicon(tab.url),
            type: 'tab'
          })),
          'url'
        ),
        task: MessageTasks.openApp
      };
      chrome.tabs.sendMessage(tab.id, JSON.stringify(message));
    }
  }

  if (command === ManifestCommands.listTabs) {
    const tabs = await Browser.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab.id) return;

    const allTabs = await Browser.tabs.query({});
    console.log('tabs', tabs.length, tabs);

    await Browser.tabs.sendMessage(
      tab.id,
      JSON.stringify({
        tabs: uniqueArray(
          allTabs.map((tab) => ({
            id: String(tab.id), // TabはIdがNumber
            url: tab.url,
            title: tab.title,
            faviconUrl: createFavicon(tab.url),
            type: 'tab'
          })),
          'url'
        ),
        task: MessageTasks.listTabs
      })
    );
  }

  return true;
});

Browser.runtime.onMessage.addListener(async (request) => {
  if (request.task === MessageTasks.changeTab) {
    console.log('reqiues', request);
    const tabId = request.tabId;
    const tab = await Browser.tabs.get(request.tabId);
    await Browser.tabs.update(tabId, { active: true });
    await Browser.windows.update(tab.windowId!, { focused: true });
  }

  return true;
});
