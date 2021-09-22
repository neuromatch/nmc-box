import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import useComponentVisible from "../../hooks/useComponentVisible"
import { basedStyles } from "../../styles"
import { Fa } from "../../utils"
import EditionPicker from "../EditionPicker"
import TimezonePicker from "../TimezonePicker"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
`

const CogIcon = styled(Fa).attrs(() => ({
  icon: 'cog',
  style: {
    fontSize: '1.35em',
  }
}))`
  color: ${p => p.theme.colors.secondary};

  ${basedStyles.interxEffect}
`

const ModalContainer = styled.div`
  min-width: 250px;

  position: absolute;
  right: 0;
  top: 1.75em;

  background-color: ${p => p.theme.colors.primary};

  border: 1px solid ${p => p.theme.colors.secondary};
  border-radius: 2px;

  z-index: 1;

  padding: 0.5em 0.75em;
`

const EachPickerContainer = styled.div`
  margin-bottom: 0.5em;
`

const TimezoneEditionModal = ({ onEditionChange }) => {
  const {
    ref: visibleRef,
    isComponentVisible,
    setIsComponentVisible,
  } = useComponentVisible(false)

  return (
    <Container ref={visibleRef}>
      <CogIcon onClick={() => setIsComponentVisible(prev => !prev)} />
      {isComponentVisible
        ? (
          <ModalContainer>
            <EachPickerContainer>
              <label>
                Edition
              </label>
              <EditionPicker onChange={onEditionChange} />
            </EachPickerContainer>
            <EachPickerContainer>
              <label>
                Time Zone
              </label>
              <TimezonePicker />
            </EachPickerContainer>
          </ModalContainer>
        )
        : null}
    </Container>
  )
}

TimezoneEditionModal.propTypes = {
  onEditionChange: PropTypes.func.isRequired,
}

export default TimezoneEditionModal
