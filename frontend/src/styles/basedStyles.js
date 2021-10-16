import { css } from "styled-components"
import colors from "./colors"
import sizes from "./sizes"

// ---- CSS HELPERS
const interxEffect = css`
  :hover {
    opacity: 0.9;
  }

  :active {
    opacity: 0.5;
  }
`

const noInterxEffect = css`
  :hover,
  :active {
    opacity: 1;
  }
`

// never used anywhere in this project yet
const buttonStyle = css`
  all: unset;
  cursor: pointer;

  color: white;
  background-color: ${colors.primary};
  border: none;
  border-radius: ${sizes[1]}rem;

  padding: ${sizes[2]}rem ${sizes[3]}rem;

  ${interxEffect} :disabled {
    cursor: not-allowed;
    background-color: ${colors.disabled};

    ${noInterxEffect}
  }
`

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
`

const simpleTableStyle = css`
  table,
  td,
  tr,
  th,
  td,
  tbody,
  thead {
    border-color: ${p => p.theme.colors.secondary};
  }

  table {
    table-layout: auto;
    width: auto;

    font-size: 0.8em;

    margin: auto;
    margin-bottom: 1.56rem;
  }

  td,
  th {
    padding: 0.4rem;
    padding-top: 0.25rem;
    padding-bottom: calc(0.25rem - 1px);
  }

  th:first-child,
  td:first-child {
    padding-left: 0.4rem;
  }

  th:last-child,
  td:last-child {
    padding-right: 0.4rem;
  }
`

export default {
  interxEffect,
  noInterxEffect,
  buttonStyle,
  scrollStyle,
  simpleTableStyle,
}
