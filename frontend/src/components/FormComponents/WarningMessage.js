import styled from "styled-components"

const WarningMessage = styled.span`
  color: #eb4034;

  &::before {
    display: inline;
    content: "⚠️ ";
  }
`

export default WarningMessage
