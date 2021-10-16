import Typography from "typography"
import moragaTheme from "typography-theme-moraga"

// override those of theme
moragaTheme.headerFontFamily = ["Nunito"]
moragaTheme.bodyFontFamily = ["Open Sans"]
moragaTheme.googleFonts = [
  {
    name: "Nunito",
    styles: [300, 400, 600],
  },
  {
    name: "Open Sans",
    styles: [300, 400, 600],
  },
  {
    name: "Roboto Mono",
    styles: [300, 400],
  },
]
moragaTheme.overrideThemeStyles = ({ rhythm }) => ({
  h3: {
    marginBottom: rhythm(2 / 3),
  },
  h4: {
    fontSize: rhythm(3 / 4),
  },
  h5: {
    fontSize: rhythm(5 / 8),
  },
  h6: {
    fontSize: rhythm(3 / 8),
  },
  "h4,h5,h6": {
    marginBottom: rhythm(1 / 2),
  },
})

const typography = new Typography(moragaTheme)

export default typography
export const { rhythm } = typography
