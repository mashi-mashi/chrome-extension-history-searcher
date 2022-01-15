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

import { useBrowserRuntime } from '../hooks/useBrowserRuntime';
import { useDebounceValue } from '../hooks/useDebounse';
import { useFuse } from '../hooks/useFuse';
import { MessageTasks } from '../util/constant';
import { Spacer } from './Spacer';

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

export const SearchBox = React.memo<{
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
  // const inputRef = useRef<HTMLInputElement>(null);
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

  const openLink = useCallback(
    (selected?: RowType) => {
      if (!selected) return;

      const url = selected.url;
      const type = selected.type;

      type === 'tab'
        ? sendMessage({
            tabId: Number(selected.id),
          })
        : window.open(url);
    },
    [sendMessage],
  );

  const onEnterHandler = useCallback(
    (event) => {
      // open入れとかないとGoogle検索とかBindされる？
      if (event.keyCode === 13 && open) {
        const selected = results[selectedIndex];
        openLink(selected);
      }
    },
    [open, results, selectedIndex, openLink],
  );

  useEffect(() => {
    // inputRef?.current?.focus();
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
          <SearchIcon
            sx={{
              height: '1.2em',
              width: '1.2em',
              marginRight: '8px',
            }}
          />
          <TextField
            autoFocus
            // inputRef={inputRef}
            sx={{
              '& .MuiInputBase-input': {
                fontSize: 20,
                fontFamily: 'Noto Sans CJK JP',
              },
            }}
            variant="standard"
            onChange={onChangeSearchText}
            value={searchText}
            fullWidth
          />
        </Box>
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
                        openLink(results[index]);
                      }}
                    >
                      <StyledTableCell>
                        <Badge
                          sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 40,
                            height: 40,
                          }}
                        >
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
