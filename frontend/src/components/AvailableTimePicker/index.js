import moment from "moment-timezone"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import styled, { css } from "styled-components"
import useEventTime, { timeOptions } from "../../hooks/useEventTime"
import useTimezone from "../../hooks/useTimezone"
import { media } from "../../styles"
import { color, datetime, Fa } from "../../utils"

// -- COMPONENTS
const Container = styled.div`
  height: auto;
  width: 100%;
`

const GridContainer = styled.div`
  display: grid;

  grid-gap: 1px;
  grid-template-columns: repeat(12, 1fr);

  ${media.medium`
    grid-template-columns: repeat(6, 1fr);
  `}

  ${media.extraSmall`
    grid-template-columns: repeat(4, 1fr);
  `}

  margin-bottom: 10px;
`

const GridItem = styled.button.attrs(() => ({
  type: "button",
  role: "button",
}))`
  outline: none;
  text-align: center;
  cursor: pointer;

  background-color: white;
  border: 1px solid ${p => p.theme.colors.disabled};
  border-radius: 4px;
  padding: 8px;

  /* set color/bg for active */
  ${p =>
    p.isActive &&
    css`
      background-color: ${p => p.theme.colors.succeed};
    `}

  /* handle hover/active */
  ${p =>
    !p.isActive &&
    !p.disabled &&
    css`
      :hover {
        background-color: #eee;
      }
      :active {
        background-color: #ccc;
      }
    `}

  /* handle disabled */
  ${p =>
    p.disabled &&
    css`
      cursor: default;
      background-color: ${p => p.theme.colors.disabled};
    `}
`

const GridLabel = styled.p`
  /* based color for time text is lighter black */
  color: ${p => color.scale(p.theme.colors.black, 15)};
  margin: 0;
  font-size: 14px;

  /* set color for disabled */
  ${p =>
    p.disabled &&
    css`
      color: ${p => color.scale(p.theme.colors.grey, 30)};
    `}

  /* set color/bg for active */
  ${p =>
    p.isActive &&
    css`
      color: ${p => color.contrast(p.theme.colors.succeed)};
      font-weight: bold;
    `}
`

const DateLabel = styled.p`
  font-size: 14px;
  font-weight: bold;

  margin: 0;
  margin-bottom: 3px;
`

/**
 *
 * @param {Object} props
 * @param {String[]} props.timeBoundary - this boundary is used to check if the item is in date range or not
 * @returns
 */
const EachDateBlock = ({ date, value, onChange, timeBoundary, timezone }) => {
  const [selected, setSelected] = useState(value)

  useEffect(() => {
    // if value from origin changes, update here too
    setSelected(value)
  }, [value])

  return (
    <>
      <DateLabel>{date}</DateLabel>
      <GridContainer>
        {timeOptions.map(time => {
          const thisOption = {
            label: time,
            value: datetime.timezoneParser(`${date} ${time}`, timezone).toISOString(),
          }
          const exist = selected.includes(thisOption.value)
          const disabled = !moment(thisOption.value).isBetween(
            timeBoundary[0],
            timeBoundary[1],
            undefined,
            "[)"
          )

          return (
            <GridItem
              disabled={disabled}
              isActive={exist}
              key={thisOption.label}
              onClick={() => {
                let updated

                if (exist) {
                  updated = selected.filter(sel => sel !== thisOption.value)
                } else {
                  updated = [...selected, thisOption.value]
                }

                setSelected(updated)
                onChange(updated)
              }}
            >
              <GridLabel disabled={disabled} isActive={exist}>
                {time}
              </GridLabel>
            </GridItem>
          )
        })}
      </GridContainer>
    </>
  )
}

EachDateBlock.propTypes = {
  date: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  timeBoundary: PropTypes.arrayOf(PropTypes.string).isRequired,
  timezone: PropTypes.string.isRequired,
}

EachDateBlock.defaultProps = {
  value: [],
  onChange: () => {},
}

// -- MAIN
const AvailableTimePicker = ({ value, onChange }) => {
  // local state
  const [selectedDatetime, setSelectedDatetime] = useState([])
  // constants but get from hook
  const { timezone } = useTimezone()
  const { mainConfTimeBoundary, dateRange } = useEventTime()

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
      {dateRange.map(date => (
        <EachDateBlock
          key={date}
          date={date}
          timezone={timezone}
          timeBoundary={mainConfTimeBoundary}
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
