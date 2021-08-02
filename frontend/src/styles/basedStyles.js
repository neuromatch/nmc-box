import { css } from 'styled-components';
import colors from './colors';
import sizes from './sizes';

// ---- CONSTANTS
const mediaSizes = {
  extraSmall: 576,
  small: 768,
  medium: 992,
  large: 1200,
  extraLarge: 1200,
};

// ---- CSS HELPERS
const interxEffect = css`
  :hover {
    opacity: 0.75;
  }

  :active {
    opacity: 0.95;
  }
`;

const noInterxEffect = css`
  :hover, :active {
    opacity: 1;
  }
`;

const buttonStyle = css`
  all: unset;
  cursor: pointer;

  color: white;
  background-color: ${colors.primary};
  border: none;
  border-radius: ${sizes[1]}rem;

  padding: ${sizes[2]}rem ${sizes[3]}rem;

  ${interxEffect}

  :disabled {
    cursor: not-allowed;
    background-color: ${colors.disabled};

    ${noInterxEffect}
  }
`;

const scrollStyle = css`
  /* width */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  /* track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  /* handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

// ---- FUNCTIONS
const growOverParentPadding = (widthPercent) => css`
  /* grow over parent's padding in small screen */
  width: ${widthPercent}vw;
  position: relative;
  left: 50%;
  margin-left: -${widthPercent / 2}vw;
`;

// https://www.styled-components.com/docs/advanced#media-templates
// Iterate through the sizes and create a media template
/**
 * @typedef {Object} mediaQueries
 * @property {function=} extraSmall
 * @property {function=} small
 * @property {function=} medium
 * @property {function=} large
 * @property {function=} extraLarge
 */
/** @type {mediaQueries} */
const media = Object.keys(mediaSizes).reduce((acc, label) => {
  if (label === 'extraLarge') {
    acc[label] = (...args) => css`
      @media (min-width: ${mediaSizes[label] / 16}em) {
        ${css(...args)}
      }
    `;
  } else {
    acc[label] = (...args) => css`
      @media (max-width: ${mediaSizes[label] / 16}em) {
        ${css(...args)}
      }
    `;
  }

  return acc;
}, {});

export default {
  interxEffect,
  noInterxEffect,
  buttonStyle,
  scrollStyle,
  growOverParentPadding,
  media,
};
