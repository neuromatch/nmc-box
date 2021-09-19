import moment from "moment-timezone"
import PropTypes from "prop-types"
import React from "react"
import useTimezone from "../../hooks/useTimezone"
import { Select } from "../FormComponents/SelectWrapper"

// -- CONSTANTS
const timezoneOptions = moment.tz
  .names()
  .filter(n => n.includes("/")) // only those have /
  .map(n => ({
    label: n.replace(/_/g, " "),
    value: n,
  }))

// -- MAIN
const TimezonePicker = ({ onChange }) => {
  const { timezone, setTimezone } = useTimezone()

  return (
    <Select
      css={`
        min-width: 200px;
        margin-bottom: 10px;
      `}
      options={timezoneOptions}
      defaultValue={timezoneOptions.find(({ value }) => value === timezone)}
      onChange={x => {
        onChange(x.value)
        setTimezone(x.value)
      }}
      // components={{
      //   IndicatorSeparator: () => null,
      // }}
    />
  )
}

TimezonePicker.propTypes = {
  onChange: PropTypes.func,
}

TimezonePicker.defaultProps = {
  onChange: () => {},
}

export default TimezonePicker
