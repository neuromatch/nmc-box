// Burger.js
// thanks to https://css-tricks.com/hamburger-menu-with-a-side-of-react-hooks-and-styled-components/
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { media } from '../../../styles';

export const StyledBurger = styled.button`
  /* position: absolute; */
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 1.5rem;
  height: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 10px;
  z-index: 999;

  &:focus {
    outline: none;
  }

  div {
    width: 1.5rem;
    height: 0.2rem;
    background: ${p => p.theme.colors.secondary};
    border-radius: 15px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }

  ${media.medium`
    display: flex;
  `}
`;

const Burger = ({ handlePress }) => (
  <StyledBurger onClick={() => handlePress()}>
    <div />
    <div />
    <div />
  </StyledBurger>
);

Burger.propTypes = {
  handlePress: PropTypes.func.isRequired,
};

export default Burger;
