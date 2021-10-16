import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useRef } from "react"
import styled, { css } from "styled-components"
import { basedStyles, media } from "../../../styles"
import { themes, useThemeContext } from "../../../styles/themeContext"
import { Fa } from "../../../utils"
import RequiredAuthFragment from "../../RequiredAuthFragment"
import DropdownButton from "./DropdownButton"
import LoginButton from "./LoginButton"

// variables
const navHeight = 60

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
    ${props =>
      props.hidden &&
      css`
        overflow: hidden;
      `}

    display: block;
    flex-direction: column;
    justify-content: flex-end;
    flex: 1 1 100%;

    & > li {
      height: ${navHeight - 10}px;
    }

    ${props =>
      props.hidden &&
      css`
        display: none;
      `}
  `}
`

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
`

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
`

const ChangeThemeButton = styled.button.attrs(() => ({
  type: "button",
}))`
  cursor: pointer;
  outline: none;
  border: none;

  color: ${p => p.theme.colors.secondary};
  background-color: transparent;

  ${basedStyles.interxEffect}
`

const Menus = ({ items, hidden }) => {
  const navListRef = useRef(null)

  const { theme, setTheme } = useThemeContext()

  if (items.length === 0) {
    return null
  }

  return (
    <NavList hidden={hidden} ref={navListRef}>
      <NavItem key="theme-switch">
        <ChangeThemeButton
          onClick={() =>
            setTheme(theme === themes.light ? themes.dark : themes.light)
          }
        >
          <Fa icon={theme === themes.light ? "moon" : "sun"} />
        </ChangeThemeButton>
      </NavItem>
      {items.map(item => (
        <RequiredAuthFragment
          key={item.text || `now-loading-${Math.random()}`}
          enable={item.requiredLogin}
        >
          <NavItem>
            {item?.dropdown ? (
              <DropdownButton noButtonBorder dropdownContent={item.dropdown}>
                {item.text}
              </DropdownButton>
            ) : typeof item.onClick === "function" ? (
              <NavLinkButton type="button" as="button" onClick={item.onClick}>
                {item.text}
              </NavLinkButton>
            ) : (
              <NavLinkButton to={item.onClick}>{item.text}</NavLinkButton>
            )}
          </NavItem>
        </RequiredAuthFragment>
      ))}
      <NavItem>
        <LoginButton />
      </NavItem>
    </NavList>
  )
}

Menus.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      dropdown: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          onClick: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        })
      ),
    })
  ),
  hidden: PropTypes.bool,
}

Menus.defaultProps = {
  items: [],
  hidden: true,
}

export default Menus
