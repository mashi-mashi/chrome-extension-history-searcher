import { useCallback } from 'react';

import { MessageTasksType } from '../util/constant';

export const useBrowserRuntime = (taskName: MessageTasksType) => {
  const sendMessage = useCallback(
    (value: any) =>
      chrome.runtime.sendMessage({
        ...value,
        task: taskName,
      }),
    [taskName],
  );

  return { sendMessage };
};
