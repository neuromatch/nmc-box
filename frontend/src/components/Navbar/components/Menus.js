import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { basedStyles, media } from '../../../styles';
import { Link } from 'gatsby';
import { useThemeContext, themes } from '../../../styles/themeContext';
import DropdownButton from './DropdownButton';
import { Fa } from '../../../utils';
import LoginButton from './LoginButton';

// variables
const navHeight = 60;
const animateMenu = (startH, endH) => keyframes`
  0% {
    height: ${startH}px;
  }
  100% {
    height: ${endH}px;
  }
`;

// nav items container using ul/li
const NavList = styled.ul`
  /* flex 1 makes it a flex 1 to its parent */
  flex: 1;
  /* display flex makes its children has flex effect */
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;

  ${media.extraLarge`
    flex-direction: row;
    /* put all children items to the right */
    justify-content: flex-end;
  `}
  ${media.large`
    flex-direction: row;
    /* put all children items to the right */
    justify-content: flex-end;
  `}
  ${media.medium`
    ${(props) => props.hidden && css`
      overflow: hidden;
    `}

    display: block;
    flex-direction: column;
    justify-content: flex-end;
    flex: 1 1 100%;

    & > li {
      height: ${navHeight - 10}px;
    }

    ${(props) => (props.hidden
    ? css`
      animation: ${props.hideDuration || 0}s ${props.animateHide} forwards;
    ` : css`
      animation: 0.15s ${props.animateShow} forwards;
    `)}
  `}
`;

const NavItem = styled.li`
  display: flex;
  margin: 0;
  padding: 0 15px;
  width: auto;
  justify-content: center;
  align-items: center;

  :last-child {
    padding-right: 0px;
  }

  ${media.medium`
    padding: 0 10px;

    :last-child {
      padding-right: 10px;
    }
  `}
`;

const NavLinkButton = styled(Link)`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  color: ${p => p.theme.colors.secondary};
  border: none;
  height: 100%;

  /* -- used as button -- */
  /* reset in case using user agent stylesheet */
  padding: 0;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    color: ${p => p.theme.colors.secondary};
    text-decoration: none;
  }

  ${basedStyles.interxEffect}
`;

const ChangeThemeButton = styled.button.attrs(() => ({
  type: 'button',
}))`
  cursor: pointer;
  outline: none;
  border: none;

  color: ${p => p.theme.colors.secondary};
  background-color: transparent;

  ${basedStyles.interxEffect}
`;

const Menus = ({ items, hidden }) => {
  // workaround for hiding hiccup on first load
  const [hideDuration, setHideDuration] = useState(false);
  const [menuHeight, setMenuHeight] = useState(null);
  const navListRef = useRef(null);

  const { theme, setTheme } = useThemeContext();

  useEffect(() => {
    setMenuHeight(navListRef.current.scrollHeight);
    const timeoutRef = setTimeout(() => {
      setHideDuration(0.5);
    }, 1500);

    return () => clearTimeout(timeoutRef);
  }, [navListRef]);

  if (items.length === 0) {
    return null;
  }

  return (
    <NavList
      hidden={hidden}
      animateHide={animateMenu(menuHeight, 0)}
      animateShow={animateMenu(0, menuHeight)}
      hideDuration={hideDuration}
      ref={navListRef}
    >
      <NavItem key="theme-switch">
        <ChangeThemeButton
          onClick={() => setTheme(theme === themes.light ? themes.dark : themes.light)}
        >
          <Fa icon={theme === themes.light ? "moon" : "sun"} />
        </ChangeThemeButton>
      </NavItem>
      {
        items.map((item) => (
          <NavItem key={item.text || `now-loading-${Math.random()}`}>
            {item?.dropdown
              ? (
                <DropdownButton
                  noButtonBorder
                  dropdownContent={item.dropdown}
                >
                  {item.text}
                </DropdownButton>
              )
              : (typeof(item.onClick) === 'function')
                ? (
                  <NavLinkButton
                    type="button"
                    as="button"
                    onClick={item.onClick}
                  >
                    {item.text}
                  </NavLinkButton>
                )
                : <NavLinkButton to={item.onClick}>{item.text}</NavLinkButton> }
          </NavItem>
        ))
      }
      <NavItem>
        <LoginButton />
      </NavItem>
    </NavList>
  );
};

Menus.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    onClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    dropdown: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      onClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    })),
  })),
  hidden: PropTypes.bool,
};

Menus.defaultProps = {
  items: [],
  hidden: true,
};

export default Menus;
