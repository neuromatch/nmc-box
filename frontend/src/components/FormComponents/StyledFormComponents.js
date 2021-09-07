import React from "react"
import styled, { css } from "styled-components"
import Fa from "../../utils/fontawesome"
import { basedStyles, media } from "../../styles"
import Card from "../BaseComponents/Card"
import { UncontrolledCheckbox, ControlledCheckbox } from "./StyledCheckbox"
import StyledInputRange from "./StyledInputRange"

/**
 * @param {Object} props
 * @param {boolean=} props.fixedWidth
 */
const FormWrapper = styled(Card)`
  /* fixedWidth makes narrow UI looks better,
   * e.g. registerForm
   */
  ${props =>
    props.fixedWidth &&
    css`
      width: 520px;
    `}

  /* default children form style */
  form {
    margin-bottom: 0;
    width: 100%;
  }
`

const InputBlock = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  input:not([type="range"]) {
    padding: 2px 8px;
  }

  textarea {
    /* 30 on the right for the remove button */
    padding: 2px 30px 2px 8px;
  }

  input:not([type="range"]),
  textarea,
  select {
    border: 1px solid ${p => p.theme.colors.disabled};
    border-radius: 3px;
  }
`

const LabelBlock = styled.div`
  display: flex;
  justify-content: space-between;
`

const FieldArrayContainer = styled.ul`
  margin: 0;
`

const FieldArrayItem = styled.li`
  margin-bottom: 0;
  display: flex;
  position: relative;

  /* last child is next to warning message that we don't need margin */
  :not(:last-child) {
    margin-bottom: 6px;
  }

  /*
  <InputWithSuggestion> is a div wrapping input
  and suggestion ul inside
  */
  textarea,
  div {
    flex: 1;
  }
`

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

const RequiredIcon = styled(Fa).attrs(() => ({
  icon: "asterisk",
}))`
  margin-left: 6px;
  /* important is needed here because
  https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
  */
  font-size: 10px !important;
  margin-bottom: 2px;

  path {
    fill: ${p => p.theme.colors.danger};
  }
`

const RangeLabels = styled.div`
  font-size: 0.8rem;
  font-weight: bold;
  color: #555;
  display: flex;
  justify-content: space-between;
`

const StyledInstructionText = styled.h4`
  /* reset */
  margin: 0;
  padding: 0;

  margin-top: 10px;
  margin-bottom: 10px;

  font-weight: 600;
`

const WarningMessage = styled.span`
  color: #eb4034;

  &::before {
    display: inline;
    content: "⚠️ ";
  }
`

const CheckboxBlock = styled(InputBlock)`
  display: inline-block;
`

const DisabledWrapper = styled.div`
  & * {
    color: ${props => props.disabled && "#bbb"};
  }
`

/**
 * A block containing star score and its label
 */
const StarScoreBlock = styled.div`
  display: flex;
  align-items: center;

  /**
   * p: label
   * div: star score
   */
  & > label,
  & > div {
    margin: 0;
  }

  & > label {
    margin-right: 15px;
  }

  /* push star to the next line on mobile screen */
  ${media.extraSmall`
    display: block;

    /* move stars to center */
    & > div {
      justify-content: center;
    }
  `}
`

const TextWithButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.55em;

  * {
    margin: 0;
  }

  button {
    font-size: 0.85em;
    /* height: 2.5em; */
    :nth-child(2) {
      margin-right: 0;
    }
  }
`

const SubLabel = styled.label`
  font-size: 14.4px;
  line-height: 17px;
  margin: 2px 0 8px;
  font-style: italic;
`

export {
  FormWrapper,
  InputBlock,
  LabelBlock,
  FieldArrayContainer,
  FieldArrayItem,
  RangeLabels,
  RequiredIcon,
  StyledInputRange,
  StyledInstructionText,
  WarningMessage,
  DisabledWrapper,
  CheckboxBlock,
  StarScoreBlock,
  TextWithButtonsWrapper,
  ControlledCheckbox,
  UncontrolledCheckbox,
  SubLabel,
  AbstractButton,
}
