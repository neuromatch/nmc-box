import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import { media } from '../../styles';

const StyledFooter = styled.div`
  height: 5.5em;
  background-color: #222;

  display: flex;
  align-items: center;
  justify-content: center;

  /* on small screen it could be 4 lines */
  ${media.extraSmall`
    height: 6.5em;
  `}
`;

const StyledFooterText = styled.div`
  font-size: 0.75em;
  text-align: center;
  color: #eee;
  line-height: 1.6em;
`;

const StyledLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  color: #419eda;
`;

const StyledInternalLink = styled(Link)`
  color: #419eda;
`;

const Red = styled.span`
  color: #e23f3f;
`;

const Footer = () => (
  <StyledFooter>
    <StyledFooterText>
      Made with
      <Red>&nbsp;❤&nbsp;</Red>
      at
      <br />
      <StyledLink href="http://kordinglab.com/">
        Kording lab (University of Pennsylvania)
      </StyledLink>
      &nbsp;and&nbsp;
      <StyledLink href="http://neural-reckoning.org/">
        Neural Reckoning Lab (Imperial College)
      </StyledLink>
      <br />
      <StyledInternalLink to="/terms-of-use">
        Terms of Use | Code of Conduct
      </StyledInternalLink>
    </StyledFooterText>
  </StyledFooter>
);

export const IndexFooter = () => (
  <StyledFooter>
    <StyledFooterText>
      <StyledInternalLink to="/terms-of-use">
        Terms of Use
      </StyledInternalLink>
      { ' | ' }
      <StyledInternalLink to="https://www.neuromatchacademy.org/privacy">
        Privacy Policy
      </StyledInternalLink>
      { ' | ' }
      <StyledInternalLink to="https://www.neuromatchacademy.org/code-of-conduct">
        Code of Conduct
      </StyledInternalLink>
      { ' | Contact: ' }
      <StyledInternalLink to="mailto:info@neuromatch.io">
        info@neuromatch.io
      </StyledInternalLink>
    </StyledFooterText>
  </StyledFooter>
);

export default Footer;
