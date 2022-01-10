import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import {
  Avatar,
  Badge,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useBrowserListener } from '../hooks/useBrowserListener';
import { useBrowserRuntime } from '../hooks/useBrowserRuntime';
import { useDebounceValue } from '../hooks/useDebounse';
import { useFuse } from '../hooks/useFuse';
import { MessageTasks, MessageTasksType } from '../util/constant';
import { Spacer } from './Spacer';

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

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
`;

type RowType = {
  id: string;
  url: string;
  title: string;
  faviconUrl: string;
  type: 'tab' | 'history';
  visitCount?: number;
};

const StyledTableRow = withStyles({
  root: {
    height: 64,
  },
})(TableRow);

const StyledTableCell = withStyles({
  root: {
    padding: 4,
  },
})(TableCell);

export const BrowserHistorySearch = React.memo(() => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [tabOpen, setTabOpen] = useState(false);
  const { message } = useBrowserListener<{ task: MessageTasksType; histories: any[]; tabs: any[] }>(
    MessageTasks.openApp,
    () => setHistoryOpen((prev) => !prev),
  );

  const { message: allTabs } = useBrowserListener<{ task: MessageTasksType; histories: any[]; tabs: any[] }>(
    MessageTasks.listTabs,
    () => setTabOpen((prev) => !prev),
  );

  return (
    <>
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
    </>
  );
});

const SearchBox = React.memo<{
  allHistory: RowType[];
  open: boolean;
  onClose: () => void;
}>(({ allHistory, open, onClose }) => {
  const { search } = useFuse<RowType>(allHistory, {
    keys: ['url', 'title'],
    includeScore: true,
    isCaseSensitive: false,
    shouldSort: true,
  });
  const { sendMessage } = useBrowserRuntime(MessageTasks.changeTab);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const tableRowRef = useRef<HTMLTableRowElement>(null);

  const [searchText, setSearchText] = useState('');
  const onChangeSearchText = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target?.value;
    if (value) {
      setSearchText(value.trim());
      // 値を変えたらリセット
      setSelectedIndex(0);
    } else {
      setSearchText('');
    }
  }, []);

  const devounceValue = useDebounceValue(searchText, 100);
  const results = useMemo(() => search(devounceValue).flatMap((d) => d.item), [devounceValue, search]);

  const keyEventHandler = useCallback(
    (event) => {
      // Esc
      if (event.keyCode === 27) {
        onClose();
        return;
      }
      // 下
      if (event.keyCode === 40) {
        setSelectedIndex((prev) => (prev < 10 ? prev + 1 : 10));
      }
      // 上
      if (event.keyCode === 38) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }

      tableRowRef.current?.scrollIntoView({
        block: 'end',
      });
    },
    [onClose],
  );

  const onEnterHandler = useCallback(
    (event) => {
      // open入れとかないとGoogle検索とかBindされる？
      if (event.keyCode === 13 && open) {
        const selected = results[selectedIndex];
        if (!selected) return;

        const url = selected.url;
        const type = selected.type;

        type === 'tab'
          ? sendMessage({
              tabId: Number(selected.id),
            })
          : window.open(url);
      }
    },
    [open, results, selectedIndex, sendMessage],
  );

  useEffect(() => {
    inputRef?.current?.focus();
    document.addEventListener('keydown', keyEventHandler, false);

    return () => {
      document.removeEventListener('keydown', keyEventHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onEnterHandler);
    return () => {
      document.removeEventListener('keydown', onEnterHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, results]);

  return (
    <>
      <Flex>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
          <SearchIcon sx={{ mr: 1 }} />
          <TextField
            sx={{ fontSize: 20 }}
            inputRef={inputRef}
            variant="standard"
            onChange={onChangeSearchText}
            value={searchText}
            fullWidth
          />
        </Box>
        {/* <Typography sx={{ flex: 1 }}>{`${results.length} / ${allHistory.length}`}</Typography> */}
      </Flex>
      {results.length ? (
        <>
          <Spacer size={12} />
          <TableContainer
            sx={{
              maxHeight: 400,
            }}
          >
            <Table>
              <TableBody>
                {results.map((row, index) => {
                  return (
                    <StyledTableRow
                      key={row.id}
                      selected={index === selectedIndex}
                      ref={index === selectedIndex ? tableRowRef : null}
                      onClick={() => {
                        setSelectedIndex(index); // 一応セレクトさせておく
                        window.open(row.url);
                      }}
                    >
                      <StyledTableCell>
                        <Badge sx={{ justifyContent: 'center', alignItems: 'center', width: 40, height: 40 }}>
                          <Avatar sx={{ width: 20, height: 20 }} src={`${row.faviconUrl}`} />
                        </Badge>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography fontSize={'8px'}>{row.type}</Typography>
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        <Typography fontSize={'14px'} fontWeight={'bold'}>
                          {row.title}
                        </Typography>
                        <Typography fontSize={'8px'}>{row.url}</Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <></>
      )}
    </>
  );
});
