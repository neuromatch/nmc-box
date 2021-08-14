import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import Burger from '../BaseComponents/BurgerMenu';
import { NavContainer } from '../BaseComponents/container';
import Menus from './Menus';
import { media } from '../../styles';

// get logo image using require
// const logo = require('../../images/bluenex-avatar.jpg');
const logo = {
  path: '/svgs/logos/neuromatch-conference.svg',
  text: 'neuromatch conference logo',
};

const academyLogo = {
  path: '/svgs/logos/neuromatch-academy.svg',
  text: 'neuromatch academy logo',
};

const indexLogo = {
  path: '/svgs/logos/Logo_full_Wh.svg',
  text: 'neuromatch logo',
};

// variables
const navHeight = 60;

// navbar component
const Navbar = styled.nav`
  background-color: #222;
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
  /* this fix image color by multiplying color of image through bg */
  /* mix-blend-mode: multiply; */
  /* grow to fit its wrapper */
  height: 100%;
`;

// const StyledLink = styled(Link)`
//   &:hover {
//     text-decoration: none;
//   }
// `;

// const TitleText = styled.h2`
//   color: #eee;
//   margin: 0;
//   padding: 0;
//   height: ${navHeight}px;
//   line-height: ${navHeight}px;

//   &:hover {
//     color: #ccc;
//   }
// `;

const NavbarComponent = ({ children }) => {
  const [hideMenu, setHideMenu] = useState(true);

  return (
    <>
      <Navbar>
        <NavContainer>
          {/* <StyledLink to="/">
            <TitleText>
              neuromatch
            </TitleText>
          </StyledLink> */}
          <LogoWrapper to="/conference">
            <StyledImg src={logo.path} alt={logo.text} />
          </LogoWrapper>
          <Burger handlePress={() => setHideMenu(!hideMenu)} />
          <Menus
            hidden={hideMenu}
            items={children}
          />
        </NavContainer>
      </Navbar>
      <NavPadder />
    </>
  );
};

NavbarComponent.propTypes = {
  children: PropTypes.node,
};

NavbarComponent.defaultProps = {
  children: null,
};

const AcademyNavbar = ({ children }) => {
  const [hideMenu, setHideMenu] = useState(true);

  return (
    <>
      <Navbar>
        <NavContainer>
          {/* <StyledLink to="/">
            <TitleText>
              neuromatch
            </TitleText>
          </StyledLink> */}
          <LogoWrapper to="/academy/">
            <StyledImg src={academyLogo.path} alt={academyLogo.text} />
          </LogoWrapper>
          <Burger handlePress={() => setHideMenu(!hideMenu)} />
          <Menus
            hidden={hideMenu}
            items={children}
          />
        </NavContainer>
      </Navbar>
      <NavPadder />
    </>
  );
};

AcademyNavbar.propTypes = {
  children: PropTypes.node,
};

AcademyNavbar.defaultProps = {
  children: null,
};

const IndexNavbar = ({ children }) => {
  const [hideMenu, setHideMenu] = useState(true);

  return (
    <>
      <Navbar>
        <NavContainer>
          {/* <StyledLink to="/">
            <TitleText>
              neuromatch
            </TitleText>
          </StyledLink> */}
          <LogoWrapper to="/">
            <StyledImg src={indexLogo.path} alt={indexLogo.text} />
          </LogoWrapper>
          <Burger handlePress={() => setHideMenu(!hideMenu)} />
          <Menus
            hidden={hideMenu}
            items={children}
          />
        </NavContainer>
      </Navbar>
      <NavPadder />
    </>
  );
};

IndexNavbar.propTypes = {
  children: PropTypes.node,
};

IndexNavbar.defaultProps = {
  children: null,
};

export default NavbarComponent;
export { AcademyNavbar, IndexNavbar };
