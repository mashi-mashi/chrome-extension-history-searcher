import createTheme, { ThemeOptions as MuiThemeOptions } from '@mui/material/styles/createTheme';
import { ComponentsOverrides } from '@mui/material/styles/overrides';
import shadows, { Shadows } from '@mui/material/styles/shadows';

const overrides: ComponentsOverrides = {
  MuiInputBase: {
    root: {
      fontFamily: 'inherit',
    },
    input: {
      height: '1.2em',
      paddingTop: 5,
    },
  },
  MuiTypography: {
    root: {
      fontSize: '0.875rem',
      fontFamily: 'Noto Sans CJK JP',
    },
    body1: {
      fontSize: 'inherit',
    },
    h1: {
      fontSize: '2.25em',
    },
    h2: {
      fontSize: '1.8em',
    },
    h3: {
      fontSize: '1.5em',
    },
    h4: {
      fontSize: '1.17em',
    },
  },
  MuiMenuItem: {
    root: {
      fontFamily: 'inherit',
    },
  },
  MuiButton: {
    root: {
      fontFamily: 'inherit',
      textTransform: 'none',
    },
  },
  MuiTab: {
    root: {
      textTransform: 'none',
    },
  },
  MuiTableCell: {
    root: {
      fontFamily: 'inherit',
    },
    body: {
      position: 'relative',
    },
  },
};

const defaultMuiThemeOptions: MuiThemeOptions = {
  components: {
    MuiInputBase: { styleOverrides: overrides.MuiInputBase },
    MuiTypography: { styleOverrides: overrides.MuiTypography },
    MuiMenuItem: { styleOverrides: overrides.MuiMenuItem },
    MuiButton: { styleOverrides: overrides.MuiButton },
    MuiTab: { styleOverrides: overrides.MuiTab },
    MuiTableCell: { styleOverrides: overrides.MuiTableCell },
    MuiCssBaseline: {
      styleOverrides: {
        fontFamily: [`Noto Sans CJK JP`].join(','),
      },
    },
  },
  shape: { borderRadius: 3 },

  shadows: shadows.map(() => 'none') as Shadows,
} as const;

export const defaultMuiTheme = createTheme(defaultMuiThemeOptions);
