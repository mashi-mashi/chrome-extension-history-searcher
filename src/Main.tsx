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

const App = () => {
  const [username, setUsername] = useState('')
  const [currentStats, setCurrentStats] = useState('')
  const [currentTopLanguage, setCurrentTopLanguage] = useState('')
  const [allHistory, setAllHistory] = useState<chrome.history.HistoryItem[]>([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    console.log('init')
    chrome.history.search({ maxResults: 200, text: '' }, (historyItems) => {
      console.log('history', historyItems)
      setAllHistory(historyItems)
    })
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('tabs', tabs)
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
    </>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
