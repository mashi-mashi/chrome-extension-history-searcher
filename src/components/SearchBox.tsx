import styled from '@emotion/styled';
import {
  Avatar,
  Badge,
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

import { useBrowserListener } from '../hooks/useBroserListener';
import { useDebounceValue } from '../hooks/useDebounse';
import { useFuse } from '../hooks/useFuse';

const CenterWrapper = styled.div`
  z-index: 10000; // うーん
  width: 720px;
  height: 500px;
  position: fixed;
  background-color: white;
  border: 1px solid #d3d3d3;
  padding: 24px;
  border-radius: 12px;
  top: 40%;
  left: 50%;
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

type RowType = {
  id: string;
  url: string;
  title: string;
  faviconUrl: string;
  type: string;
  visitCount?: number;
};

const StyledTableRow = withStyles({
  root: {
    height: 32,
  },
})(TableRow);

const StyledTableCell = withStyles({
  root: {
    padding: 4,
  },
})(TableCell);

export const BrowserHistorySearch = React.memo(() => {
  const [open, setOpen] = useState(false);
  const { message } = useBrowserListener<{ task: string; histories: any[] }>('open-app', () =>
    setOpen((prev) => !prev),
  );

  return (
    <>
      {open && message?.histories?.length ? (
        <CenterWrapper>
          <SearchBox allHistory={message?.histories || []} open={open} onClose={() => setOpen(false)} />
        </CenterWrapper>
      ) : (
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
        setSelectedIndex((prev) => prev + 1);
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
        console.log(event);
        const url = results[selectedIndex]?.url;
        window.open(url);
      }
    },
    [open, results, selectedIndex],
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
        <TextField
          inputRef={inputRef}
          sx={{ flex: 5, fontSize: 14 }}
          onChange={onChangeSearchText}
          value={searchText}
        />
        {/* <Typography sx={{ flex: 1 }}>{`${results.length} / ${allHistory.length}`}</Typography> */}
      </Flex>
      <TableContainer sx={{ height: '85%' }}>
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
                    <Badge
                      sx={{ alignItems: 'center', width: 30, height: 30 }}
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={<>{row.visitCount}</>}
                    >
                      <Avatar sx={{ width: 16, height: 16 }} src={`${row.faviconUrl}`} />
                    </Badge>
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
  );
});
