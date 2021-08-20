import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';
import { basedStyles } from '../../styles';
import { color } from '../../utils';
import Fa from '../../utils/fontawesome';

// -- declare base styles
const commonButtonStyle = css`
  cursor: pointer;
  color: ${p => p.color || p.theme.colors.secondary};
  background-color: transparent;

  border: 1px solid ${p => p.color || color.scale(p.theme.colors.secondary, 15)};
  border-radius: 5px;

  /* handle space in case of multiple buttons in the same parent */
  /* margin: auto 4px; */
  padding: 3px 12px;

  &:disabled {
    color: ${p => p.theme.colors.disabled};
    border-color: ${p => p.theme.colors.disabled};
    background-color: transparent;
    cursor: default;

    &:hover {
      opacity: 1;
      color: ${p => p.theme.colors.disabled};
      background-color: transparent;
    }
  }

  &:focus {
    outline: none;
  }

  ${basedStyles.interxEffect}
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
  noBorder: PropTypes.bool,
};

LineButton.defaultProps = {
  color: null,
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

export {
  LineButton,
  ToggleLineButton,
  ButtonWithLinkStyle,
  FontIconButton,
  FormButton,
  ButtonsContainer,
};
