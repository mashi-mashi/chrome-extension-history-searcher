import { useCallback, useEffect, useState } from 'react';

import { MessageTasksType } from '../util/constant';

const safeParse = <T,>(string: string) => {
  try {
    return JSON.parse(string) as T;
  } catch (e) {
    console.warn('failed to parse message.', e);
  }
};

export const useBrowserListener = <T extends { task: MessageTasksType }>(
  taskName: MessageTasksType,
  callback?: () => void,
) => {
  const [message, setMessage] = useState<T>();

  const chromeMessageHandler = useCallback((request: any) => {
    const message = safeParse<T>(request);

    if (message?.task === taskName) {
      callback?.();
      setMessage(message);
    }

    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(chromeMessageHandler);

    return () => {
      chrome.runtime.onMessage.removeListener(chromeMessageHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    message,
  };
};
