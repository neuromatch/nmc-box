import React from "react"
import HashLoader from "react-spinners/HashLoader"
import styled from "styled-components"
import PropTypes from "prop-types"
import { media } from "../../styles"
import { useThemeContext } from "../../styles/themeContext"
import { color } from "../../utils"

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100vh;

  background-color: ${p => p.theme.colors.primary};
`

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
`

const LoadingView = ({ message, ...restProps }) => {
  const { themeObject } = useThemeContext()

  return (
    <Container {...restProps}>
      <HashLoader
        color={color.format(themeObject.colors.secondary, color.hexFormatter)}
        size={75}
      />
      {message ? <Message>{message}</Message> : null}
    </Container>
  )
}

LoadingView.propTypes = {
  message: PropTypes.string,
}

LoadingView.defaultProps = {
  message: "Loading..",
}

export default LoadingView
