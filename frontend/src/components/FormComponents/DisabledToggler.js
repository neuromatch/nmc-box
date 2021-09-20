import styled from "styled-components"

const DisabledToggler = styled.div`
  & * {
    color: ${props => props.disabled && "#bbb"};
  }
`

export default DisabledToggler
