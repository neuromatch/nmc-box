import React, { createContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import colors from './colors';

// -- CONSTANTS
export const themes = {
  light: 'LIGHT',
  dark: 'DARK',
};
const defaultTheme = themes.light;
const themeCookieKey = 'theme';

// -- CONTEXT
const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
})

// eslint-disable-next-line react/prop-types
const ThemeProvider = ({ children }) => {
  const [cookies, setCookie] = useCookies([themeCookieKey]);
  const [theme, setTheme] = useState(cookies[themeCookieKey] || defaultTheme)

  // update cookies on theme change
  useEffect(() => {
    setCookie(themeCookieKey, theme);
  }, [setCookie, theme]);

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
    }}>
      <StyledComponentsThemeProvider
        theme={{
          colors: colors[theme.toLowerCase()],
        }}
      >
        {children}
      </StyledComponentsThemeProvider>
    </ThemeContext.Provider>
  )
}

const useThemeContext = () => {
  const themeState = React.useContext(ThemeContext)

  if (typeof themeState === 'undefined') {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }

  return themeState
}

export { ThemeProvider, useThemeContext }