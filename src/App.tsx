import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import React from 'react';

import { SearchBox } from './page/SearchBox';
import { defaultMuiTheme } from './util/style';

export const App = () => (
  <>
    <ThemeProvider theme={defaultMuiTheme}>
      <CssBaseline />
      <SearchBox />
    </ThemeProvider>
  </>
);
