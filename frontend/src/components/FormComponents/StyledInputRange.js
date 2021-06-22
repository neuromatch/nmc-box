// taken from https://github.com/darlanrod/input-range-scss/blob/master/_inputrange.scss

import styled, { css } from 'styled-components';

const trackColor = '#eceff1';
const thumbColor = '#333';
const thumbActiveColor = '#000';

const thumbRadius = 12;
const thumbHeight = 24;
const thumbWidth = 24;
const thumbShadowSize = 4;
const thumbShadowBlur = 4;
const thumbShadowColor = 'rgba(0, 0, 0, .2)';
const thumbBorderWidth = 2;
const thumbBorderColor = '#888';

const trackWidth = '100%';
const trackHeight = 8;
const trackShadowSize = 1;
const trackShadowBlur = 1;
const trackShadowColor = 'rgba(0, 0, 0, .2)';
const trackBorderWidth = 2;
const trackBorderColor = '#bbb';

const trackRadius = 5;
const contrast = '5%';

const ieBottomTrackColor = `darken(${trackColor}, ${contrast})`;

const shadow = (shadowSize, shadowBlur, shadowColor) => css`
  box-shadow: ${shadowSize}px ${shadowSize}px ${shadowBlur}px ${shadowColor}, 0 0 ${shadowSize}px lighten(${shadowColor}, 5%);
`;

const track = css`
  cursor: default;
  height: ${trackHeight}px;
  transition: all .2s ease;
  width: ${trackWidth};
`;

const thumb = css`
  ${shadow(thumbShadowSize, thumbShadowBlur, thumbShadowColor)};
  background: ${thumbColor};
  border: ${thumbBorderWidth}px solid ${thumbBorderColor};
  border-radius: ${thumbRadius}px;
  box-sizing: border-box;
  cursor: default;
  height: ${thumbHeight}px;
  width: ${thumbWidth}px;

  &:active {
    background: ${thumbActiveColor};
  }
`;

const disabled = css`
  cursor: not-allowed;
  background-color: #e0e0e0;
`;

const StyledInputRange = styled.input.attrs(() => ({
  type: 'range',
}))`
  -webkit-appearance: none;
  background: transparent;
  margin: ${thumbHeight / 2}px 0;
  width: ${trackWidth};

  &::-moz-focus-outer {
    border: 0;
  }

  &:focus {
    outline: 0;

    &::-webkit-slider-runnable-track {
      background: lighten(${trackColor}, ${contrast});
    }

    &::-ms-fill-lower {
      background: ${trackColor};
    }

    &::-ms-fill-upper {
      background: lighten(${trackColor}, ${contrast});
    }
  }

  &::-webkit-slider-runnable-track {
    ${track}
    ${shadow(trackShadowSize, trackShadowBlur, trackShadowColor)};
    background: ${trackColor};
    border: ${trackBorderWidth}px solid ${trackBorderColor};
    border-radius: ${trackRadius}px;
  }

  &::-webkit-slider-thumb {
    ${thumb}
    -webkit-appearance: none;
    margin-top: ${((-trackBorderWidth * 2 + trackHeight) / 2 - thumbHeight / 2)}px;
  }

  &::-moz-range-track {
    ${shadow(trackShadowSize, trackShadowBlur, trackShadowColor)};
    ${track};
    background: ${trackColor};
    border: ${trackBorderWidth}px solid ${trackBorderColor};
    border-radius: ${trackRadius}px;
    height: ${trackHeight / 2}px;
  }

  &::-moz-range-thumb {
    ${thumb}
  }

  &::-ms-track {
    ${track}
    background: transparent;
    border-color: transparent;
    border-width: ${thumbHeight / 2}px 0;
    color: transparent;
  }

  &::-ms-fill-lower {
    ${shadow(trackShadowSize, trackShadowBlur, trackShadowColor)};
    background: ${ieBottomTrackColor};
    border: ${trackBorderWidth}px solid ${trackBorderColor};
    border-radius: ${trackRadius * 2}px;
  }

  &::-ms-fill-upper {
    ${shadow(trackShadowSize, trackShadowBlur, trackShadowColor)};
    background: ${trackColor};
    border: ${trackBorderWidth}px solid ${trackBorderColor};
    border-radius: ${trackRadius * 2}px;
  }

  &::-ms-thumb {
    ${thumb}
    margin-top: ${trackHeight / 4}px;
  }

  &:disabled {
    /* we can't mix styles of platform specific here */
    &::-webkit-slider-thumb,
    &::-webkit-slider-runnable-track {
      ${disabled}
    }

    &::-moz-range-thumb {
      ${disabled}
    }

    &::-ms-thumb,
    &::-ms-fill-lower,
    &::-ms-fill-upper {
      ${disabled}
    }
  }
`;

export default StyledInputRange;
