import { Link } from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// variables
const navHeight = 60;

const StyledLink = styled(Link)`
  &:hover {
    text-decoration: none;
  }
`;

const TitleText = styled.h2`
  color: #eee;
  margin: 0;
  padding: 0;
  height: ${navHeight}px;
  line-height: ${navHeight}px;

  &:hover {
    color: #ccc;
  }
`;

const LogoAsText = ({ children }) => (
  <StyledLink to="/">
    <TitleText>
      {children}
    </TitleText>
  </StyledLink>
);

LogoAsText.propTypes = {
  children: PropTypes.string.isRequired,
};

export default LogoAsText;
