import { createGlobalStyle } from 'styled-components';
import basedStyles from './basedStyles';

// ---- MAIN
const GlobalStyles = createGlobalStyle`
  ${basedStyles.scrollStyle}
`;

// ---- DYNAMIC STYLES COLLECTION
const LockHorizontalScroll = createGlobalStyle`
  html, body {
    overflow-x: hidden;
  }
`;

const LockVerticalScroll = createGlobalStyle`
  html, body {
    overflow-y: hidden;
  }
`;

const LockScrollWithVerticalControl = createGlobalStyle`
  html, body {
    overflow-x: hidden;
    overflow-y: ${(props) => (props.shouldLock ? 'hidden' : 'auto')}
  }
`;

export default {
  GlobalStyles,
  LockHorizontalScroll,
  LockVerticalScroll,
  LockScrollWithVerticalControl,
};
