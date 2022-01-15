import { useCallback } from 'react';

import { MessageTasksType } from '../util/constant';

export const useBrowserRuntime = (taskName: MessageTasksType) => {
  const sendMessage = useCallback(
    async (value: any) => {
      chrome.runtime.sendMessage({
        ...value,
        task: taskName,
      });

      return true;
    },
    [taskName],
  );

  return { sendMessage };
};
