import { Link } from "gatsby"
import React from "react"
import styled from "styled-components"
import { media } from "../../styles"
import { color } from "../../utils"

const StyledFooter = styled.div`
  height: 5.5em;
  background-color: ${p =>
    color.scale(p.theme.colors.primary, p.theme.colors.factor * 7)};

  display: flex;
  align-items: center;
  justify-content: center;

  /* on small screen it could be 4 lines */
  ${media.extraSmall`
    height: 6.5em;
  `}
`

const StyledFooterText = styled.div`
  font-size: 0.75em;
  text-align: center;
  color: ${p => p.theme.colors.secondary};
  line-height: 1.6em;
`

const StyledLink = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: ${p => p.theme.colors.accent};
`

// const StyledInternalLink = styled(Link)`
//   color: ${p => p.theme.colors.accent};
// `;

const Red = styled.span`
  color: ${p => p.theme.colors.danger};
`

const Footer = () => (
  <StyledFooter>
    <StyledFooterText>
      Made with
      <Red>&nbsp;❤&nbsp;</Red>
      {"by "}
      <StyledLink href="https://neuromatch.io/">NMC organizers</StyledLink>
      <br />
      <Link to="/terms-of-use">
        Terms of Use | Code of Conduct
      </Link>
    </StyledFooterText>
  </StyledFooter>
)

export default Footer
