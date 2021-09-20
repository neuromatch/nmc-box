import React from "react"
import styled, { css } from "styled-components"
import { basedStyles } from "../../../styles"
import { Fa } from "../../../utils"

const AbstractButtonContainer = styled.button.attrs(() => ({
  type: "button",
}))`
  cursor: pointer;
  outline: none;

  border: none;
  color: ${p => p.theme.colors.secondary};
  background-color: transparent;
  text-align: center;
  text-decoration: none;
  font-size: 18px;

  ${basedStyles.interxEffect}

  ${props =>
    props.action === "remove" &&
    css`
      position: absolute;
      top: 1px;
      right: 1px;
      color: ${p => p.theme.colors.danger};
    `}
`

// eslint-disable-next-line react/prop-types
const AbstractButton = ({ action, ...buttonProps }) => (
  <AbstractButtonContainer {...buttonProps} action={action}>
    <Fa icon={action === "add" ? "plus-square" : "minus-square"} />
  </AbstractButtonContainer>
)

export default AbstractButton
