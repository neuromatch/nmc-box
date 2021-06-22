import Typography from 'typography';
import moragaTheme from 'typography-theme-moraga';

// override those of theme
moragaTheme.headerFontFamily = ['Nunito'];
moragaTheme.bodyFontFamily = ['Open Sans'];
moragaTheme.googleFonts = [
  {
    name: 'Nunito',
    styles: [
      300, 400, 600,
    ],
  },
  {
    name: 'Open Sans',
    styles: [
      300, 400, 600,
    ],
  },
];

const typography = new Typography(moragaTheme);

export default typography;
export const { rhythm } = typography;
