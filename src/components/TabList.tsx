import React, { useState } from 'react';

import { useBrowserListener } from '../hooks/useBrowserListener';
import { MessageTasksType, MessageTasks } from '../util/constant';

export const TabList = React.memo(() => {
  const [open, setOpen] = useState(false);
  const { message } = useBrowserListener<{ task: MessageTasksType; histories: any[]; tabs: any[] }>(
    MessageTasks.listTabs,
    () => setOpen((prev) => !prev),
  );

  return <>{open && message?.histories?.length ? <>{message}</> : <></>}</>;
});
