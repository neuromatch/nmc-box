import styled, { css } from "styled-components"
import Card from "../BaseComponents/Card"

/**
 * @param {Object} props
 * @param {boolean=} props.fixedWidth
 */
const FormContainer = styled(Card)`
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

export default FormContainer
