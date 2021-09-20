import styled from "styled-components"
import { Fa } from "../../utils"

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

export default RequiredIcon
