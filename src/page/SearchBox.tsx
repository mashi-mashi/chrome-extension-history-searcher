import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Typography,
  TextField,
} from '@mui/material'
import styled from '@emotion/styled'

const CenterWrapper = styled.div`
  width: 500px;
  height: 320px;
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
`

export const SearchBox = () => {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [currentStats, setCurrentStats] = useState('')
  const [currentTopLanguage, setCurrentTopLanguage] = useState('')
  const [allHistory, setAllHistory] = useState<chrome.history.HistoryItem[]>([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    console.log('hhhhhh')
    chrome.history?.search({ maxResults: 10000, text: '' }, (historyItems) => {
      console.log('history', historyItems)
      setAllHistory(historyItems)
    })
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('tabs', tabs)
    })
    chrome.runtime.onMessage.addListener((request) => {
      console.log('get message', request)
      if (request === 'open-app') {
        console.log('pppppp')
        setOpen((_open) => !_open)
      }
    })
  }, [])

  useEffect(() => {}, [])

  const results = useMemo(
    () =>
      allHistory
        ? allHistory.filter(
            (h) => h.title?.includes(searchText) || h.url?.includes(searchText)
          )
        : [],
    [allHistory, searchText]
  )

  return (
    <>
      {open ? (
        <CenterWrapper>
          <Typography>{'rrrrr!!!'}</Typography>
          <Box width="540px">
            <Box p={5}>
              <div dangerouslySetInnerHTML={{ __html: currentStats }} />
              <div dangerouslySetInnerHTML={{ __html: currentTopLanguage }} />
              <Typography>{'test1111111!!!'}</Typography>
            </Box>

            <TextField
              onChange={(event) => {
                const value = event.target?.value
                if (value) {
                  setSearchText(value)
                }
              }}
            />

            {`${results.length} / ${allHistory.length}`}

            {JSON.stringify(results)}

            <Box pb={2} pl={4} pr={4}></Box>
          </Box>
        </CenterWrapper>
      ) : (
        <div style={{ display: 'none' }}></div>
      )}
    </>
  )
}
