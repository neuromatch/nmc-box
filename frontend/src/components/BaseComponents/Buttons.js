import PropTypes from "prop-types"
import styled, { css } from "styled-components"
import { basedStyles } from "../../styles"
import { color } from "../../utils"

// -- declare base styles
const commonButtonStyle = css`
  cursor: pointer;
  color: ${p => p.color || p.theme.colors.secondary};
  background-color: transparent;

  border: 1px solid ${p => p.color || color.scale(p.theme.colors.secondary, 15)};
  border-radius: 5px;

  /* handle space in case of multiple buttons in the same parent */
  /* margin: auto 4px; */
  padding: 3px 12px;

  &:disabled {
    color: ${p => p.theme.colors.disabled};
    border-color: ${p => p.theme.colors.disabled};
    background-color: transparent;
    cursor: default;

    &:hover {
      opacity: 1;
      color: ${p => p.theme.colors.disabled};
      background-color: transparent;
    }
  }

  &:focus {
    outline: none;
  }

  ${basedStyles.interxEffect}
`

const toggledButtonColor = css`
  background-color: ${p => p.color};
  border-color: ${p => p.hoverBgColor};
  color: ${p => p.hoverColor};
`

const commonLinkStyle = css`
  /* reset */
  padding: 0;
  margin: 0;
  border: none;

  /* style */
  cursor: pointer;

  color: #419eda;
  background-color: transparent;

  text-align: left;

  /* hover */
  &:hover {
    outline: none;
    color: #2a6496;
    text-decoration: underline;
  }

  &:active,
  &:focus {
    outline: none;
  }
`

// -- container for button(s)
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;

  padding: 5px;
`

// -- button components consuming base styles
const LineButton = styled.button.attrs(() => ({
  type: "button",
}))`
  ${commonButtonStyle}

  /* border can be optional */
  ${p =>
    p.noBorder &&
    css`
      border: none;
    `}
`

LineButton.propTypes = {
  color: PropTypes.string,
  noBorder: PropTypes.bool,
}

LineButton.defaultProps = {
  color: null,
  noBorder: false,
}

const ToggleLineButton = styled(LineButton)`
  /* color for active button */
  ${p => p.active && toggledButtonColor}

  &:active {
    ${toggledButtonColor}
  }

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.75;
  }
`

const ButtonWithLinkStyle = styled.button.attrs(() => ({
  type: "button",
}))`
  ${commonLinkStyle}
`

// -- button in form
const FormButton = styled(LineButton).attrs(() => ({
  type: "submit",
}))``

FormButton.propTypes = {
  color: PropTypes.string,
}

FormButton.defaultProps = {
  color: null,
}

export {
  LineButton,
  ToggleLineButton,
  ButtonWithLinkStyle,
  FormButton,
  ButtonsContainer,
}
