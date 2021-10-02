import React from "react"
import ReactDOM from "react-dom"
import { CookiesProvider } from "react-cookie"
import { ThemeProvider } from "./src/styles/themeContext"

export const wrapRootElement = ({ element }) => (
  <CookiesProvider>
    <ThemeProvider>{element}</ThemeProvider>
  </CookiesProvider>
)

// this is a hack to fix missing styles on refresh in production
// reference: https://github.com/gatsbyjs/gatsby/issues/17676#issuecomment-535796737
export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
    ReactDOM.render(element, container, callback)
  }
}
