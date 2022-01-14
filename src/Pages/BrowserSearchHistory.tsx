import styled from '@emotion/styled';
import { ClickAwayListener } from '@mui/material';
import React, { useState } from 'react';

import { SearchBox } from '../components/SearchBox';
import { useBrowserListener } from '../hooks/useBrowserListener';
import { MessageTasks, MessageTasksType } from '../util/constant';

const CenterWrapper = styled.div`
  z-index: 10000; // うーん
  min-width: 360px;
  max-width: 720px;
  max-height: 520px;
  position: fixed;
  background-color: white;
  border: 1.5px solid #d3d3d3;
  padding: 20px;
  border-radius: 12px;
  top: 10%;
  left: 30%;
  @media (max-width: 1024px) {
    left: 10%;
  }
`;

export const BrowserHistorySearch = React.memo(() => {
  const [historyOpen, setHistoryOpen] = useState(false);
  // const [tabOpen, setTabOpen] = useState(false);
  const { message } = useBrowserListener<{
    task: MessageTasksType;
    histories: any[];
    tabs: any[];
  }>(MessageTasks.openApp, () => setHistoryOpen((prev) => !prev));

  // const { message: allTabs } = useBrowserListener<{
  //   task: MessageTasksType;
  //   histories: any[];
  //   tabs: any[];
  // }>(MessageTasks.listTabs, () => setTabOpen((prev) => !prev));

  return (
    <ClickAwayListener onClickAway={() => setHistoryOpen(false)}>
      {historyOpen && message?.histories?.length ? (
        <CenterWrapper>
          <SearchBox
            allHistory={[...message?.histories, ...message?.tabs] || []}
            open={historyOpen}
            onClose={() => setHistoryOpen(false)}
          />
        </CenterWrapper>
      ) : (
        //  : tabOpen && allTabs?.tabs?.length ? (
        //   <CenterWrapper>
        //     <SearchBox allHistory={[...allTabs.tabs] || []} open={tabOpen} onClose={() => setTabOpen(false)} />
        //   </CenterWrapper>
        // )
        <></>
      )}
    </ClickAwayListener>
  );
});
