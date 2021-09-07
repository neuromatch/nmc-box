import moment from "moment-timezone"
import PropTypes from "prop-types"
import React from "react"
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
const TimezonePicker = ({ currentTimezone, onTimezoneChange }) => (
  <Select
    css={`
      min-width: 200px;
      margin-bottom: 10px;
    `}
    options={timezoneOptions}
    defaultValue={timezoneOptions.find(
      ({ value }) => value === currentTimezone
    )}
    onChange={x => {
      onTimezoneChange(x.value)
    }}
    // components={{
    //   IndicatorSeparator: () => null,
    // }}
  />
)

TimezonePicker.propTypes = {
  currentTimezone: PropTypes.string.isRequired,
  onTimezoneChange: PropTypes.func,
}

TimezonePicker.defaultProps = {
  onTimezoneChange: () => {},
}

export default TimezonePicker
