import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Typography,
} from '@mui/material'

const App = () => {
  const [username, setUsername] = useState('')
  const [currentStats, setCurrentStats] = useState('')
  const [currentTopLanguage, setCurrentTopLanguage] = useState('')

  useEffect(() => {
    console.log('init')
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentURL = tabs[0].url || ''
      console.log('currentUrl', currentURL)
    })
  }, [])

  useEffect(() => {}, [])

  return (
    <>
      <Typography>{'test1111111!!!'}</Typography>
      <Box width="540px" color={'red'}>
        <Box p={5}>
          <div dangerouslySetInnerHTML={{ __html: currentStats }} />
          <div dangerouslySetInnerHTML={{ __html: currentTopLanguage }} />
          <Typography>{'test1111111!!!'}</Typography>
        </Box>
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
