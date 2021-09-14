import styled from "styled-components"

const WarningMessage = styled.span`
  color: ${p => p.theme.colors.danger};

  &::before {
    display: inline;
    content: "⚠️ ";
  }
`

export default WarningMessage
