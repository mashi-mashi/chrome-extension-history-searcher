import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useBrowserRuntime } from "../hooks/useBrowserRuntime";
import { useDebounceValue } from "../hooks/useDebounse";
import { useFuse } from "../hooks/useFuse";
import { MessageTasks } from "../util/constant";
import { Spacer } from "./Spacer";

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
  type: "tab" | "history";
  visitCount?: number;
};

const StyledTableRow = withStyles({
  root: {
    height: 64,
    width: "100%",
  },
})(TableRow);

const StyledTableCell = withStyles({
  root: {
    padding: 4,
  },
})(TableCell);

const CenterTextField = React.memo(
  ({
    onChangeSearchText,
    inputRef,
    searchText,
  }: {
    inputRef: React.RefObject<HTMLInputElement>;
    onChangeSearchText: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    searchText: string;
  }) => (
    <TextField
      autoFocus
      inputRef={inputRef}
      onBlur={() => {
        console.log("buler!!!");
        inputRef?.current?.focus();
      }}
      sx={{
        "& .MuiInputBase-input": {
          fontSize: 20,
          fontFamily: "Noto Sans CJK JP",
        },
      }}
      variant="standard"
      onChange={onChangeSearchText}
      defaultValue={searchText}
      fullWidth
    />
  )
);

export const SearchBox = React.memo<{
  allHistory: RowType[];
  open: boolean;
  onClose: () => void;
}>(({ allHistory, open, onClose }) => {
  const { search } = useFuse<RowType>(allHistory, {
    keys: ["url", "title"],
    includeScore: true,
    isCaseSensitive: false,
    shouldSort: true,
  });

  const { sendMessage } = useBrowserRuntime(MessageTasks.changeTab);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tableRowRef = useRef<HTMLTableRowElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchText, setSearchText] = useState("");
  const onChangeSearchText = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target?.value;
      inputRef?.current?.focus();
      if (value) {
        setSearchText(value.trim());
        // 値を変えたらリセット
        setSelectedIndex(0);
      } else {
        setSearchText("");
      }
    },
    []
  );

  const devounceValue = useDebounceValue(searchText, 100);
  const results = useMemo(
    () => search(devounceValue).flatMap((d) => d.item),
    [devounceValue, search]
  );

  const keyEventHandler = useCallback((event: any) => {
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
      block: "end",
    });
  }, []);

  const openLink = useCallback(
    (selected?: RowType) => {
      if (!selected) return;

      const url = selected.url;
      const type = selected.type;

      type === "tab"
        ? sendMessage({
            tabId: Number(selected.id),
          })
        : window.open(url);
    },
    [sendMessage]
  );

  const onEnterHandler = useCallback(
    (event: any) => {
      // open入れとかないとGoogle検索とかBindされる？
      if (event.keyCode === 13 && open) {
        const selected = results[selectedIndex];
        openLink(selected);
      }
    },
    [open, results, selectedIndex, openLink]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyEventHandler, false);

    return () => {
      document.removeEventListener("keydown", keyEventHandler);
    };
  }, [keyEventHandler]);

  useEffect(() => {
    document.addEventListener("keydown", onEnterHandler);
    return () => {
      document.removeEventListener("keydown", onEnterHandler);
    };
  }, [selectedIndex, results, onEnterHandler]);

  return (
    <>
      <Flex>
        <SearchIcon
          sx={{
            height: "1.2em",
            width: "1.2em",
            marginRight: "8px",
          }}
        />
        <CenterTextField
          onChangeSearchText={onChangeSearchText}
          searchText={searchText}
          inputRef={inputRef}
        />
      </Flex>
      {results.length ? (
        <div>
          <Spacer size={12} />
          <TableContainer
            sx={{
              maxHeight: 400,
              width: "100%",
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
                      <StyledTableCell sx={{ width: 48 }}>
                        <Avatar
                          sx={{ width: 16, height: 16 }}
                          src={`${row.faviconUrl}`}
                        />
                      </StyledTableCell>
                      <StyledTableCell sx={{ width: 70 }}>
                        <Typography fontSize={"8px"}>{row.type}</Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        sx={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          maxWidth: 0,
                        }}
                      >
                        <Typography fontSize={"14px"} fontWeight={"bold"}>
                          {row.title}
                        </Typography>
                        <Typography
                          textOverflow={"ellipsisdwa"}
                          fontSize={"8px"}
                        >
                          {row.url}
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : (
        <></>
      )}
    </>
  );
});
