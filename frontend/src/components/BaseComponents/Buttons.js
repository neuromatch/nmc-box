import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import useComponentVisible from '../../hooks/useComponentVisible';
import Fa from '../../utils/fontawesome';
import { media } from '../../utils/ui';

// -- declare base styles
const commonButtonStyle = css`
  padding: 3px 12px;

  border: 1px solid ${(props) => props.color};
  border-radius: 5px;

  color: ${(props) => props.color};
  background-color: transparent;

  cursor: pointer;

  &:hover {
    opacity: 0.9;
    /* color: ${(p) => p.hoverColor};
    background-color: ${(p) => p.hoverBgColor}; */
  }

  &:disabled {
    color: #bbb;
    border-color: #bbb;
    background-color: transparent;
    cursor: default;

    &:hover {
      opacity: 1;
      color: #bbb;
      background-color: transparent;
    }
  }

  &:focus {
    outline: none;
  }

  &:active {
    outline: none;
    opacity: 0.5;

    /* border-color: ${(p) => p.activeBgColor};

    color: ${(p) => p.hoverBgColor};
    background-color: ${(p) => p.activeBgColor}; */
  }

  /* --
  * handle space in case of multiple buttons
  * in the same parent
  -- */
  margin: 4px;
`;

const toggledButtonColor = css`
  background-color: ${(p) => p.color};
  border-color: ${(p) => p.hoverBgColor};
  color: ${(p) => p.hoverColor};
`;

const commonLinkStyle = css`
  /* reset */
  padding: 0;
  margin: 0;
  border: none;

  /* style */
  color: #419eda;
  background-color: transparent;

  text-align: left;

  cursor: pointer;

  /* hover */
  &:hover {
    outline: none;

    color: #2a6496;

    text-decoration: underline;
  }

  &:active, &:focus {
    outline: none;
  }
`;

const fontIconButtonStyle = css`
  /* margin-left: 5px; */
  outline: none;

  /* background-color: #333; */
  border: none;
  color: #333;
  /* border-radius: 3px; */
  /* padding: 0 10px; */
  text-align: center;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background-color: #eee;
    color: #333;
  }

  &:active {
    outline: none;
    background-color: rgba(256, 256, 256, 0.2);
    border-color: rgba(256, 256, 256, 0.2);
    color: #222;
  }
`;

// -- container for button(s)
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;

  padding: 5px;
`;

// -- button components consuming base styles
const LineButton = styled.button.attrs(() => ({
  type: 'button',
}))`
  ${commonButtonStyle}

  /* border can be optional */
  ${(p) => p.noBorder && css`border: none;`}
`;

LineButton.propTypes = {
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  hoverBgColor: PropTypes.string,
  activeBgColor: PropTypes.string,
  noBorder: PropTypes.bool,
};

LineButton.defaultProps = {
  color: '#eee',
  hoverColor: '#333',
  hoverBgColor: '#fff',
  activeBgColor: 'rgba(256,256,256,0.2)',
  noBorder: false,
};

const ToggleLineButton = styled(LineButton)`
  /* color for active button */
  ${(p) => p.active && toggledButtonColor}

  &:active {
    ${toggledButtonColor}
  }

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.75;
  }
`;

const ButtonWithLinkStyle = styled.button.attrs(() => ({
  type: 'button',
}))`
  ${commonLinkStyle}
`;

const FontIconButtonWrapper = styled.button.attrs(() => ({
  type: 'button',
}))`
  ${fontIconButtonStyle}
  ${(props) => props.removeButton
    && css`
      position: absolute;
      top: 1px;
      right: 1px;
      color: red;
    `}
`;

const FontIconButton = ({ icon, ...rest }) => (
  <FontIconButtonWrapper
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  >
    <Fa icon={icon} />
  </FontIconButtonWrapper>
);

FontIconButton.propTypes = {
  icon: PropTypes.string.isRequired,
};

// -- button in form
const FormButton = styled(LineButton).attrs(() => ({
  type: 'submit',
}))`
  :active {
    opacity: 0.5;
  }

  ${(props) => props.disabled && css`
    color: #bbb;
    background-color: transparent;
    border-color: #bbb;
    cursor: default;

    &:hover {
      color: #bbb;
      background-color: transparent;
      border-color: #bbb;
    }
  `}
`;

FormButton.propTypes = {
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  hoverBgColor: PropTypes.string,
};

FormButton.defaultProps = {
  color: '#333',
  hoverColor: '#fff',
  hoverBgColor: '#444',
};

// -- dropdown -> this extends LineButton
const DropdownWrapper = styled.div`
  position: relative;

  button {
    padding-right: 8px;
  }
`;

const DropdownItemsContainer = styled.ul`
  /* reset */
  margin: 0;
  padding: 0;

  position: absolute;
  top: 2.25rem;
  right: 0;

  list-style-type: none;
  background-color: #fff;

  border: 1px solid #ccc;
  border-radius: 2px;
  overflow: hidden;

  /* on navbar it is overlayed by other buttons */
  z-index: 1;

  /* center the dropdown box on mobile */
  ${media.medium`
    width: 150px;
    left: 50%;
    margin-left: -75px;
  `}
`;

const DropdownItem = styled.li`
  /* reset */
  margin: 0 !important;
  padding: 0 12px;
  height: 45px;

  white-space: nowrap;

  text-align: center;
  /* width: 150px; */
  /* margin: 0; */

  display: flex;

  /* it is out of center in responsive */
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #eee;
    cursor: pointer;

    button, a {
      color: #419eda;
    }
  }

  &:active {
    background-color: #ddd;
  }

  button, a {
    /* reset */
    margin: 0 !important;
    padding: 0;

    padding: 7px 20px;

    background-color: transparent;
    border: none;
    cursor: pointer;
    text-decoration: none;
    color: #444;

    /* for clicking */
    flex: 1;

    &:hover, &:focus, &:active {
      outline: none;
    }
  }

  /*
    On mobile, there is no actual :hover. The hover effect will show
    only after the user actually click, so just about the same as :active.
  */
  ${media.medium`
    padding: 0;
  `}
`;

/**
 * @typedef DropdownContent
 * @property {string} text
 * @property {function|string} onClick - string is binded with <Link>,
 * function is binded with <button>
 *
 * DropdownButton
 * @param {Object} props
 * @param {import('react').ReactChild} props.children
 * @param {DropdownContent[]} props.dropdownContent
 */
const DropdownButton = ({
  children, dropdownContent, buttonColorProps, itemsContainerStyles, noButtonBorder,
}) => {
  const { ref: visibleRef, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  return (
    <DropdownWrapper ref={visibleRef}>
      <LineButton
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        noBorder={noButtonBorder}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...buttonColorProps}
      >
        {children}
        &nbsp;
        {
          isComponentVisible
            ? <Fa icon="caret-up" />
            : <Fa icon="caret-down" />
        }
      </LineButton>
      {
        isComponentVisible
          ? (
            <DropdownItemsContainer css={itemsContainerStyles}>
              {
                dropdownContent.map((item) => (
                  typeof item.onClick === 'string'
                    ? (
                      <DropdownItem key={item.text}>
                        <Link to={item.onClick}>
                          {item.text}
                        </Link>
                      </DropdownItem>
                    )
                    : typeof item.onClick === 'function'
                      ? (
                        <DropdownItem key={item.text}>
                          <button onClick={item.onClick} type="button">
                            {item.text}
                          </button>
                        </DropdownItem>
                      )
                      : null
                ))
              }
            </DropdownItemsContainer>
          )
          : null
      }
    </DropdownWrapper>
  );
};

DropdownButton.propTypes = {
  children: PropTypes.string,
  dropdownContent: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    onClick: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
  })).isRequired,
  buttonColorProps: PropTypes.shape({
    color: PropTypes.string,
    hoverColor: PropTypes.string,
    hoverBgColor: PropTypes.string,
  }),
  itemsContainerStyles: PropTypes.arrayOf(PropTypes.string),
  noButtonBorder: PropTypes.bool,
};

DropdownButton.defaultProps = {
  children: 'ok',
  buttonColorProps: {},
  itemsContainerStyles: undefined,
  noButtonBorder: false,
};

export {
  LineButton,
  ToggleLineButton,
  ButtonWithLinkStyle,
  FontIconButton,
  FormButton,
  ButtonsContainer,
  DropdownButton,
};
