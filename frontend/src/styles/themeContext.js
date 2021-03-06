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

      h1, h2, h3, h4, h5, h6, label, summary, th, thead {
        color: ${p => p.theme.colors.secondary};
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

      p, span, dl, ul, ol, td, tbody {
        /* slightly dimmer */
        color: ${p =>
          color.scale(p.theme.colors.secondary, p.theme.colors.factor * -7)};
      }

      code {
        font-family: 'Roboto Mono', monospace;

        &:not(pre *) {
          background-color: ${p =>
            color.transparentize(p.theme.colors.secondary, 0.15)};
          border: 1px solid ${p => p.theme.colors.accent};
          border-radius: 4px;

          padding: 1px 4px;
        }
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
