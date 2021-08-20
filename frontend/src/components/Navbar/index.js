import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import Burger from './components/BurgerMenu';
import { NavContainer } from '../BaseComponents/container';
import Menus from './components/Menus';
import { media } from '../../styles';
import { useThemeContext } from '../../styles/themeContext';
// import LogoAsText from './components/LogoAsText';

// place logo in static folder
const logo = {
  dark: '/svgs/logos/neuromatch-conference.svg',
  light: '/svgs/logos/neuromatch-conference-light.svg',
  text: 'neuromatch conference logo',
};

// variables
const navHeight = 60;

// navbar component
const Navbar = styled.nav`
  background-color: ${p => p.theme.colors.primary};
  min-height: ${navHeight}px;
  position: fixed;
  top: 0;
  width: 100%;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.19);
  z-index: 999;
`;

// nav is fixed, so it needs padder underneath
const NavPadder = styled.div`
  height: ${navHeight}px;
`;

const LogoWrapper = styled(Link)`
  display: flex;
  /* determine image size here */
  height: ${navHeight}px;
  padding: 14px 0;

  ${media.extraSmall`
    margin-left: 10px;
  `}
`;

const StyledImg = styled.img`
  margin: 0;

  /* grow to fit its wrapper */
  height: 100%;
`;

const NavbarComponent = ({ menuItems }) => {
  const [hideMenu, setHideMenu] = useState(true);
  const { theme } = useThemeContext();

  return (
    <>
      <Navbar>
        <NavContainer>
          {/* top-left logo can be a text too */}
          {/* <LogoAsText>
            neuromatch
          </LogoAsText> */}
          <LogoWrapper to="/">
            <StyledImg
              src={logo[theme.toLowerCase()]}
              alt={logo.text}
            />
          </LogoWrapper>
          <Burger handlePress={() => setHideMenu(!hideMenu)} />
          <Menus
            hidden={hideMenu}
            items={menuItems}
          />
        </NavContainer>
      </Navbar>
      <NavPadder />
    </>
  );
};

NavbarComponent.propTypes = {
  menuItems: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

NavbarComponent.defaultProps = {
  menuItems: null,
};

export default NavbarComponent;
