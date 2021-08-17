import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { media } from '../../styles';
import { Fa } from '../../utils';
import { DropdownButton, FontIconButton, LineButton } from '../BaseComponents/Buttons';
import { Link } from 'gatsby';

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
    /* need to hide this only in responsive rendering */
    /* TODO: still doesn't work as expect */
    /* if set hidden, the dropdown wont work */
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

    li:last-child {
      margin-bottom: 5px;
    }

    li a {
      justify-content: flex-start;
    }

    & > :not(:last-child):active {
      background-color: #333;
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

const StyledLink = styled(Link)`
  color: #eee;
  height: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #eee;
    opacity: 0.9;
    text-decoration: none;
  }

  margin: 4px;
`;

const StyledFontIconButton = styled(FontIconButton)`
  cursor: pointer;
  color: #eee;
  background-color: transparent;

  margin: 4px;

  :hover {
    opacity: 0.9;
    background-color: transparent;
    color: #eee;
  }

  :active {
    opacity: 0.5;
    background-color: transparent;
    border-color: transparent;
    color: #eee;
  }
`;

const Menus = ({ items, hidden }) => {
  // workaround for hiding hiccup on first load
  const [hideDuration, setHideDuration] = useState(false);
  const [menuHeight, setMenuHeight] = useState(null);
  const navListRef = useRef(null);

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
                  <LineButton noBorder onClick={item.onClick}>
                    {item.text}
                  </LineButton>
                )
                : <StyledLink to={item.onClick}>{item.text}</StyledLink> }
          </NavItem>
        ))
      }
    </NavList>
  );
};

Menus.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    onClick: PropTypes.string,
    dropdown: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      onClick: PropTypes.string,
    })),
  })),
  hidden: PropTypes.bool,
};

Menus.defaultProps = {
  items: [],
  hidden: true,
};

export default Menus;
