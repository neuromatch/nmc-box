import styled, { css } from 'styled-components';
import { media } from '../../styles';
import { rhythm } from '../../utils/typography';

const bsContainerWidth = {
  extraSmall: null,
  small: '540px',
  medium: '720px',
  large: '960px',
  // extraLarge: '960px',
  extraLarge: '1140px',
};

const Container = styled.div`
  /* this is for footer to sticky at bottom */
  flex: 1;
  margin: 0 auto;

  ${(p) => !p.noPadding && css`
    padding: ${rhythm(1)};
    padding-top: ${rhythm(1.5)};
    padding-bottom: ${rhythm(1.5)};
    /* bottom 0 helps get rid of unwanted dark area above footer */
    padding-bottom: ${(props) => !props.padBottom && 0};
  `}

  ${media.extraLarge`
    width: ${bsContainerWidth.extraLarge};
  `}

  ${media.large`
    width: ${bsContainerWidth.large};
  `}

  ${media.medium`
    width: ${bsContainerWidth.medium};
  `}

  ${media.small`
    width: ${bsContainerWidth.small};

    ${(p) => !p.noPadding && css`
      padding: ${rhythm(1)} ${rhythm(0.75)};
      /* this helps get rid of unwanted dark area above footer */
      padding-bottom: ${(props) => !props.padBottom && 0};
    `}
  `}

  ${media.extraSmall`
    width: 100%;
  `}
`;

const NavContainer = styled(Container)`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${rhythm(1)};

  ${media.small`
    width: ${bsContainerWidth.small};
    padding: 0 ${rhythm(0.25)};
  `}

  ${media.extraSmall`
    width: 100%;
  `}
`;

export { Container, NavContainer };
