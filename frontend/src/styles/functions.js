import { css } from 'styled-components';

// ---- CONSTANTS
const mediaSizes = {
  extraSmall: 576,
  small: 768,
  medium: 992,
  large: 1200,
  extraLarge: 1200,
};

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

export default { growOverParentPadding, media };
