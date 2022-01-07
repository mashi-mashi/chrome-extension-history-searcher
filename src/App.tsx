import { ThemeProvider } from '@emotion/react';
import { ScopedCssBaseline } from '@mui/material';
import React from 'react';

import { BrowserHistorySearch } from './components/SearchBox';
import { defaultMuiTheme } from './util/style';

export const App = () => (
  <>
    <ThemeProvider theme={defaultMuiTheme}>
      <ScopedCssBaseline>
        <BrowserHistorySearch />
      </ScopedCssBaseline>
    </ThemeProvider>
  </>
);
