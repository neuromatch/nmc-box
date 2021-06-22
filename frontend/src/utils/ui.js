import { css } from 'styled-components';

const mediaSizes = {
  extraSmall: 576,
  small: 768,
  medium: 992,
  large: 1200,
  extraLarge: 1200,
};

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

class Mixins {
  static customScroll() {
    return css`
      /* width */
      ::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      /* Track */
      ::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      /* Handle */
      ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 3px;
      }

      /* Handle on hover */
      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `;
  }

  static growOverParentPadding(widthPercent) {
    return css`
      /* grow over parent's padding in small screen */
      width: ${widthPercent}vw;
      position: relative;
      left: 50%;
      margin-left: -${widthPercent / 2}vw;
    `;
  }
}

export {
  mediaSizes,
  media,
  Mixins,
};
