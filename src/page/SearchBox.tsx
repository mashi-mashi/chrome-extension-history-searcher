import styled from "@emotion/styled";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
    console.warn("failed to parse message.", e);
  }
};

export const SearchBox = () => {
  const [open, setOpen] = useState(false);
  const [currentStats, setCurrentStats] = useState("");
  const [currentTopLanguage, setCurrentTopLanguage] = useState("");
  const [allHistory, setAllHistory] = useState<chrome.history.HistoryItem[]>(
    []
  );
  const [searchText, setSearchText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const ref = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const tableRowRef = useRef<HTMLTableRowElement>(null);

  const results = useMemo(
    () =>
      allHistory
        ? allHistory.filter((h) =>
            searchText
              ? h.title?.includes(searchText) || h.url?.includes(searchText)
              : true
          )
        : [],
    [allHistory, searchText]
  );

  const keyEventTrigger = useCallback(
    (event) => {
      // Esc
      if (event.keyCode === 27) setOpen(false);
      // 下
      if (event.keyCode === 40) {
        setSelectedIndex((prev) => prev + 1);
        // tableRef.current?.scrollIntoView(true)
        console.log("t0", selectedIndex);
        console.log("t0", tableRef.current?.offsetHeight);
        console.log("t1", tableRowRef.current?.offsetHeight);
        console.log("ref", tableRowRef.current);
        tableRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
      // 上
      if (event.keyCode === 38)
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    },
    [tableRowRef.current]
  );

  const onEnterLinkPage = useCallback(
    (event) => {
      if (event.keyCode === 13) {
        const url = results[selectedIndex]?.url;
        console.log(selectedIndex, url);
        window.open(url);
      }
    },
    [selectedIndex, results]
  );

  const chromeMessageHandler = useCallback((request: any) => {
    const message = safeParse<{ task: string; histories: any[] }>(request);
    if (message?.task === "open-app") {
      setOpen((_open) => !_open);
      setAllHistory(message.histories);
      console.log("ref.current", ref.current);
      ref.current?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", keyEventTrigger, false);
    chrome.runtime.onMessage.addListener(chromeMessageHandler);
    return () => {
      document.removeEventListener("keydown", keyEventTrigger);
      chrome.runtime.onMessage.removeListener(chromeMessageHandler);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onEnterLinkPage, false);
    return () => {
      document.removeEventListener("keydown", onEnterLinkPage);
    };
  }, [selectedIndex, results]);

  useEffect(() => {}, []);

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
                    setSearchText("");
                  }
                }}
              />
              <div style={{ flex: 1 }}>
                <Typography>{`${results.length} / ${allHistory.length}`}</Typography>
              </div>
            </Flex>
            <TableContainer style={{ height: "85%" }}>
              <Table ref={tableRef}>
                <TableBody>
                  {results.map((row, index) => (
                    <TableRow
                      key={row.id}
                      selected={index === selectedIndex}
                      ref={tableRowRef}
                    >
                      <TableCell component="th" scope="row">
                        <Typography fontSize={"1rem"} fontWeight={"bold"}>
                          {row.title}
                        </Typography>
                        <Typography fontSize={"0.7rem"}>{row.url}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </CenterWrapper>
      ) : (
        <div style={{ display: "none" }}></div>
      )}
    </>
  );
};
