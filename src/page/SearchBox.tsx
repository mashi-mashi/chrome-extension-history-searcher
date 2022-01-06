import styled from '@emotion/styled'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useMemo, useRef, useState } from 'react'

const CenterWrapper = styled.div`
  z-index: 10000; // うーん
  width: 720px;
  height: 500px;
  position: absolute;
  background-color: white;
  border: 1px solid #d3d3d3;
  padding: 24px;
  border-radius: 12px;
  top: 20vh;
  left: 50%;
  bottom: 0;
  margin: auto;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
`

const safeParse = <T extends any>(string: string) => {
  try {
    return JSON.parse(string) as T
  } catch (e) {
    console.warn('failed to parse message.', e)
  }
}

export const SearchBox = () => {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [currentStats, setCurrentStats] = useState('')
  const [currentTopLanguage, setCurrentTopLanguage] = useState('')
  const [allHistory, setAllHistory] = useState<chrome.history.HistoryItem[]>([])
  const [searchText, setSearchText] = useState('')

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request) => {
      const message = safeParse<{ task: string; histories: any[] }>(request)
      if (message?.task === 'open-app') {
        setOpen((_open) => !_open)
        setAllHistory(message.histories)
        console.log('ref.current', ref.current)
        ref.current?.focus()
      }
    })
  }, [ref.current])

  useEffect(() => {}, [])

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
  )

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
                  const value = event.target?.value
                  if (value) {
                    setSearchText(value)
                  }
                }}
              />
              <div style={{ flex: 1 }}>
                <Typography>{`${results.length} / ${allHistory.length}`}</Typography>
              </div>
            </Flex>
            <TableContainer style={{ height: '85%' }}>
              <Table>
                <TableBody>
                  {results.map((row) => (
                    <TableRow key={row.id}>
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
  )
}
