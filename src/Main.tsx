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
import { SearchBox } from './page/SearchBox'

export const App = () => (
  <div>
    <SearchBox />
  </div>
)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
