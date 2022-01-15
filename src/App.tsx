import { ThemeProvider } from '@emotion/react';
import { ScopedCssBaseline } from '@mui/material';
import React from 'react';
import root from 'react-shadow/emotion';

import { BrowserHistorySearch } from './Pages/BrowserSearchHistory';
import { defaultMuiTheme } from './util/style';

export const App = () => (
  // 外部のCSSの影響を受けないためにShadowDOMを利用
  <root.section>
    <ThemeProvider theme={defaultMuiTheme}>
      <ScopedCssBaseline>
        <BrowserHistorySearch />
      </ScopedCssBaseline>
    </ThemeProvider>
  </root.section>
);
