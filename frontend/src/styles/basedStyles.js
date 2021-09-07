import { css } from 'styled-components';
import colors from './colors';
import sizes from './sizes';

// ---- CSS HELPERS
const interxEffect = css`
  :hover {
    opacity: 0.9;
  }

  :active {
    opacity: 0.5;
  }
`;

const noInterxEffect = css`
  :hover, :active {
    opacity: 1;
  }
`;

// never used anywhere in this project yet
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

export default {
  interxEffect,
  noInterxEffect,
  buttonStyle,
  scrollStyle,
};
