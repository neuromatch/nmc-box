import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import useTimezone from "../../hooks/useTimezone"
import { Fa } from "../../utils"
import EachDateBlock from "./EachDateBlock"
import usePrepareAvailableTimeData from "./usePrepareAvailableTimeData"

// -- COMPONENTS
const Container = styled.div`
  height: auto;
  width: 100%;
`

// -- MAIN
const AvailableTimePicker = ({ value, onChange }) => {
  // local state
  const [selectedDatetime, setSelectedDatetime] = useState([])
  // constants but get from hook
  const { timezone } = useTimezone()
  const {
    availableTimePickerRange,
    availableTimePickerBoundary,
  } = usePrepareAvailableTimeData()

  useEffect(() => {
    // if value from origin changes, update here too
    setSelectedDatetime(value)
  }, [value])

  if (!value) {
    // this should never happen, but keep it just in case
    return (
      <p css="text-align: center; margin-top: 1.56rem;">
        Now loading... <Fa icon="sync" spin />
      </p>
    )
  }

  return (
    <Container>
      {availableTimePickerRange.map(date => (
        <EachDateBlock
          key={date}
          date={date}
          timezone={timezone}
          timeBoundary={availableTimePickerBoundary}
          value={selectedDatetime?.find(x => x.date === date)?.time}
          onChange={updatedVal => {
            const exist = selectedDatetime.find(x => x.date === date)
            const selfInd = selectedDatetime.indexOf(exist)
            let updatedParentVal

            if (exist) {
              updatedParentVal = [
                ...selectedDatetime.slice(0, selfInd),
                {
                  ...exist,
                  time: updatedVal,
                },
                ...selectedDatetime.slice(selfInd + 1),
              ]
            } else {
              updatedParentVal = [
                ...selectedDatetime,
                {
                  date,
                  time: updatedVal,
                },
              ]
            }

            const filtered = updatedParentVal.filter(x => x.time.length !== 0)

            setSelectedDatetime(filtered)
            onChange(filtered)
          }}
        />
      ))}
    </Container>
  )
}

AvailableTimePicker.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  onChange: PropTypes.func,
}

AvailableTimePicker.defaultProps = {
  value: [],
  onChange: () => {},
}

export default AvailableTimePicker
