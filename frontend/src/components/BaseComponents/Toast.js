import PropTypes from "prop-types"
import React, { Component } from "react"
import styled from "styled-components"
import { color } from "../../utils"

const toastTypes = {
  success: "succeed",
  info: "info",
  warning: "warning",
  error: "danger",
}

const Container = styled.div`
  margin-bottom: 1em;
  min-height: 40px;
  width: 100%;
  background-color: ${p => color.transparentize(p.theme.colors[p.type], 0.2)};
  border: 1px solid ${p => p.theme.colors[p.type]};
  border-radius: 3px;

  display: flex;
  align-items: center;
`

const ToastText = styled.p`
  margin: 0;
  padding: 0 15px;
  font-size: 0.85em;
  color: ${p => p.theme.colors.secondary};
`

/**
 * Toast
 * @param {Object} props
 * @param {string=} props.message - can be omitted to set later via ref
 * @param {string=} props.type - default is info
 */
class Toast extends Component {
  constructor() {
    super()
    this.state = {
      visible: false,
      dynamicText: undefined,
      dynamicType: undefined,
    }

    // second
    this.displayDuration = 3

    // // to be clean
    // this.timeInstance = undefined;
  }

  // componentWillUnmount() {
  //   clearTimeout(this.timeInstance);
  // }

  show(type, text) {
    this.setState({
      visible: true,
      dynamicType: type,
      dynamicText: text,
    })

    // this.timeInstance = setTimeout(() => {
    //   this._hide();
    // }, this.displayDuration * 1000);
  }

  _hide() {
    this.setState({
      visible: false,
    })
  }

  render() {
    const { message, type } = this.props
    const { dynamicText, dynamicType } = this.state
    const { visible } = this.state

    return visible ? (
      <Container type={dynamicType || type}>
        <ToastText>{dynamicText || message}</ToastText>
      </Container>
    ) : null
  }
}

Toast.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
}

Toast.defaultProps = {
  message: "",
  type: toastTypes.info,
}

export { toastTypes }
export default Toast
