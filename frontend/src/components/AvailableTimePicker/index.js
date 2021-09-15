import moment from "moment-timezone"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import styled, { css } from "styled-components"
import TimezonePicker from "../TimezonePicker"
import useTimezone from "../../hooks/useTimezone"
import { media } from "../../styles"
import { color } from "../../utils"

// -- FUNCTIONS
const timezoneParser = (dtStr, tz) =>
  moment.tz(dtStr, "MMMM DD, YYYY HH:mm", tz)

// -- CONSTANTS
// TODO: this is supposed to be set in either gatsby-config or some yaml file
// start -> lower boundary - 1 day
// end -> upper boundary
const datesOptions = [
  "October 28, 2021",
  "October 29, 2021",
  "October 30, 2021",
]

// this will generate ["00:00", "01:00", ..., "23.00"]
const timeOptions = Array.from({ length: 24 }).map((_, ind) =>
  ind < 10 ? `0${ind}:00` : `${ind}:00`
)

// time boundary for picking available time
const timeBoundary = [
  timezoneParser("October 29, 2021 00:00", "UTC").toISOString(),
  timezoneParser("October 30, 2021 12:00", "UTC").toISOString(),
]

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

  /* based color for time text is lighter black */
  p {
    color: ${p => color.scale(p.theme.colors.black, 15)};
    margin: 0;
    font-size: 14px;
  }

  /* set color for disabled */
  ${p =>
    p.disabled &&
    css`
      p {
        color: ${p => color.scale(p.theme.colors.grey, 30)};
      }
    `}

  /* set color/bg for active */
  ${p =>
    p.isActive &&
    css`
      background-color: ${p => p.theme.colors.succeed};

      p {
        color: ${p => color.contrast(p.theme.colors.succeed)};
        font-weight: bold;
      }
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

const DateLabel = styled.p`
  font-size: 14px;
  font-weight: bold;

  margin: 0;
  margin-bottom: 3px;
`

const EachDateBlock = ({ date, value, onChange, timezone }) => {
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
            value: timezoneParser(`${date} ${time}`, timezone).toISOString(),
          }
          const exist = selected.includes(thisOption.value)

          return (
            <GridItem
              disabled={
                !moment(thisOption.value).isBetween(
                  timeBoundary[0],
                  timeBoundary[1],
                  undefined,
                  "[)"
                )
              }
              key={thisOption.label}
              isActive={exist}
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
              <p>{time}</p>
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
  timezone: PropTypes.string.isRequired,
}

EachDateBlock.defaultProps = {
  value: [],
  onChange: () => {},
}

// -- MAIN
const AvailableTimePicker = ({ value, onChange, onTimezoneChange }) => {
  const [selectedDatetime, setSelectedDatetime] = useState(value)
  const { timezone, setTimezone } = useTimezone()

  useEffect(() => {
    // if value from origin changes, update here too
    setSelectedDatetime(value)
  }, [value])

  return (
    <Container>
      <TimezonePicker
        currentTimezone={timezone}
        onTimezoneChange={tz => {
          setTimezone(tz)
          onTimezoneChange(tz)
        }}
      />
      {datesOptions.map(date => (
        <EachDateBlock
          key={date}
          date={date}
          timezone={timezone}
          value={selectedDatetime.find(x => x.date === date)?.time || []}
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
  onTimezoneChange: PropTypes.func,
}

AvailableTimePicker.defaultProps = {
  value: datesOptions.map(d => ({ date: d, time: [] })),
  onChange: () => {},
  onTimezoneChange: () => {},
}

export default AvailableTimePicker
export { datesOptions, timeOptions, timezoneParser, timeBoundary }
