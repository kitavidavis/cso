import React, { useState} from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './dashboard';
import { MantineProvider, ColorSchemeProvider, ColorScheme } from '@mantine/core';

function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));


  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>

    <Dashboard />

    </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
