import React, { useState, useRef, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { media } from '../../styles';

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
        Array.isArray(items)
          ? items.map((item) => (
            <NavItem key={item?.props?.children || `now-loading-${Math.random()}`}>
              {item}
            </NavItem>
          ))
          : (
            <NavItem key={items?.props?.children || `now-loading-${Math.random()}`}>
              {items}
            </NavItem>
          )
      }
    </NavList>
  );
};

Menus.propTypes = {
  items: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.object,
  ]),
  hidden: PropTypes.bool,
};

Menus.defaultProps = {
  items: [],
  hidden: true,
};

export default Menus;
