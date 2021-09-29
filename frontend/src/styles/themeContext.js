import React, { createContext, useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import {
  ThemeProvider as StyledComponentsThemeProvider,
  ThemeContext as StyledComponentsThemeContext,
  createGlobalStyle,
} from "styled-components"
import { color } from "../utils"
import colors from "./colors"

// -- CONSTANTS
export const themes = {
  light: "LIGHT",
  dark: "DARK",
}
const defaultTheme = themes.light
const themeCookieKey = "theme"

// -- CONTEXT
const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: () => {},
})

// eslint-disable-next-line react/prop-types
const ThemeProvider = ({ children }) => {
  const [cookies, setCookie] = useCookies([themeCookieKey])
  const [theme, setTheme] = useState(cookies[themeCookieKey] || defaultTheme)

  const GlobalStyles = createGlobalStyle`
    body {
      background-color: ${p => p.theme.colors.primary};

      h1, h2, h3, h4, h5, h6, label, summary {
        color: ${p => p.theme.colors.secondary};
      }

      h3 {
        margin-bottom: ${1.56 * 3 / 4}rem;
      }

      h4 {
        margin-bottom: ${1.56 * 2 / 4}rem;
      }

      h5, h6 {
        margin-bottom: ${1.56 * 1 / 4}rem;
      }

      hr {
        background-color: ${p => p.theme.colors.secondary};
      }

      a {
        color: ${p => p.theme.colors.accent};
      }

      b, em, code {
        /* slightly brighter */
        color: ${p =>
          color.scale(p.theme.colors.secondary, p.theme.colors.factor * 7)};
      }

      em {
        text-decoration: underline;
      }

      p, span, dl, ul, ol {
        /* slightly dimmer */
        color: ${p =>
          color.scale(p.theme.colors.secondary, p.theme.colors.factor * -7)};
      }
    }
  `

  // update cookies on theme change
  useEffect(() => {
    setCookie(themeCookieKey, theme)
  }, [setCookie, theme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      <StyledComponentsThemeProvider
        theme={{
          colors: colors[theme.toLowerCase()],
        }}
      >
        <GlobalStyles />
        {children}
      </StyledComponentsThemeProvider>
    </ThemeContext.Provider>
  )
}

const useThemeContext = () => {
  const themeState = React.useContext(ThemeContext)
  const themeObject = React.useContext(StyledComponentsThemeContext)

  if (typeof themeState === "undefined") {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }

  // themeState -> { theme, setTheme }
  // themeObject -> { colors }
  return {
    ...themeState,
    themeObject,
  }
}

export { ThemeProvider, useThemeContext }
