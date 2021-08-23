import React from 'react';
import HashLoader from 'react-spinners/HashLoader';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { media } from '../../styles';
import { useThemeContext } from '../../styles/themeContext';
import { color } from '../../utils';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  background-color: ${p => p.theme.colors.primary};

  ${(p) => !p.growInFlex && css`
    min-height: 100vh;
  `}
`;

const Message = styled.p`
  margin: 0;
  display: block;
  color: ${p => p.theme.colors.secondary};
  font-size: 24px;
  margin-top: 30px;
  text-align: center;
  padding: 0 5px;

  ${media.extraSmall`
    font-size: 18px;
  `}
`;

const LoadingView = ({ message, growInFlex }) => {
  const { themeObject } = useThemeContext();

  return (
    <Container growInFlex={growInFlex}>
      <HashLoader
        color={color.format(themeObject.colors.secondary, color.hexFormatter)}
        size={75}
      />
      {
        message
          ? (
            <Message>
              { message }
            </Message>
          )
          : null
      }
    </Container>
  );
};

LoadingView.propTypes = {
  message: PropTypes.string,
  growInFlex: PropTypes.bool,
};

LoadingView.defaultProps = {
  message: 'Loading..',
  growInFlex: false,
};

export default LoadingView;
