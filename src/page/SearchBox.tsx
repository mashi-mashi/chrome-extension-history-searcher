import styled from '@emotion/styled';
import { Box, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const CenterWrapper = styled.div`
  z-index: 10000; // うーん
  width: 720px;
  height: 500px;
  position: absolute;
  background-color: white;
  border: 1px solid #d3d3d3;
  padding: 24px;
  border-radius: 12px;
  top: 30vh;
  left: 50%;
  bottom: 0;
  margin: auto;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
`;

const safeParse = <T extends any>(string: string) => {
  try {
    return JSON.parse(string) as T;
  } catch (e) {
    console.warn('failed to parse message.', e);
  }
};

export const SearchBox = () => {
  const [open, setOpen] = useState(false);
  const [currentStats, setCurrentStats] = useState('');
  const [currentTopLanguage, setCurrentTopLanguage] = useState('');
  const [allHistory, setAllHistory] = useState<chrome.history.HistoryItem[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ref = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const tableRowRef = useRef<HTMLTableRowElement>(null);

  const results = useMemo(
    () =>
      allHistory
        ? allHistory.filter((h) => (searchText ? h.title?.includes(searchText) || h.url?.includes(searchText) : true))
        : [],
    [allHistory, searchText],
  );

  const keyEventHandler = useCallback((event) => {
    // Esc
    if (event.keyCode === 27) {
      setOpen(false);
      return;
    }
    // 下
    if (event.keyCode === 40) {
      setSelectedIndex((prev) => prev + 1);
    }
    // 上
    if (event.keyCode === 38) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    }

    tableRowRef.current?.scrollIntoView({
      block: 'end',
    });
  }, []);

  const onEnterHandler = useCallback(
    (event) => {
      // open入れとかないとGoogle検索とかBindされる？
      if (event.keyCode === 13 && open) {
        const url = results[selectedIndex]?.url;
        console.log(selectedIndex, url);
        window.open(url);
      }
    },
    [selectedIndex, results, open],
  );

  const chromeMessageHandler = useCallback((request: any) => {
    const message = safeParse<{ task: string; histories: any[] }>(request);
    if (message?.task === 'open-app') {
      setOpen((_open) => !_open);
      setAllHistory(message.histories);
      console.log('ref.current', ref.current);
      ref.current?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', keyEventHandler, false);
    chrome.runtime.onMessage.addListener(chromeMessageHandler);
    return () => {
      document.removeEventListener('keydown', keyEventHandler);
      chrome.runtime.onMessage.removeListener(chromeMessageHandler);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onEnterHandler);
    return () => {
      document.removeEventListener('keydown', onEnterHandler);
    };
  }, [selectedIndex, results]);

  return (
    <>
      {open ? (
        <CenterWrapper>
          <Box width="100%" height="100%">
            {/* <Box p={5}>
              <div dangerouslySetInnerHTML={{ __html: currentStats }} />
              <div dangerouslySetInnerHTML={{ __html: currentTopLanguage }} />
            </Box> */}
            <Flex>
              <TextField
                inputRef={ref}
                style={{ flex: 5 }}
                onChange={(event) => {
                  const value = event.target?.value;
                  if (value) {
                    setSearchText(value);
                    setSelectedIndex(0);
                  } else {
                    setSearchText('');
                  }
                }}
              />
              <div style={{ flex: 1 }}>
                <Typography>{`${results.length} / ${allHistory.length}`}</Typography>
              </div>
            </Flex>
            <TableContainer style={{ height: '85%' }}>
              <Table ref={tableRef}>
                <TableBody>
                  {results.map((row, index) => (
                    <TableRow
                      key={row.id}
                      selected={index === selectedIndex}
                      ref={index === selectedIndex ? tableRowRef : null}
                    >
                      <TableCell component="th" scope="row">
                        <Typography fontSize={'1rem'} fontWeight={'bold'}>
                          {row.title}
                        </Typography>
                        <Typography fontSize={'0.7rem'}>{row.url}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CenterWrapper>
      ) : (
        <div style={{ display: 'none' }}></div>
      )}
    </>
  );
};
