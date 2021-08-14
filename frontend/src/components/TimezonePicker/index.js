import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import moment from 'moment-timezone';

// -- CONSTANTS
const timezoneOptions = moment.tz.names()
  .filter((n) => n.includes('/')) // only those have /
  .map((n) => ({
    label: n.replace(/_/g, ' '),
    value: n,
  }));

// -- MAIN
const TimezonePicker = ({ currentTimezone, onTimezoneChange }) => (
  <Select
    css={`
      min-width: 200px;
      font-size: 0.8rem;
      margin-bottom: 10px;
    `}
    options={timezoneOptions}
    defaultValue={timezoneOptions.find(({ value }) => value === currentTimezone)}
    onChange={(x) => {
      onTimezoneChange(x.value);
    }}
    components={{
      IndicatorSeparator: () => null,
    }}
    theme={(theme) => ({
      ...theme,
      colors: {
        ...theme.colors,
        primary: 'rgba(34,34,34,1)',
        primary75: 'rgba(34,34,34,0.75)',
        primary50: 'rgba(34,34,34,0.5)',
        primary25: 'rgba(34,34,34,0.25)',
      },
    })}
  />
);

TimezonePicker.propTypes = {
  currentTimezone: PropTypes.string.isRequired,
  onTimezoneChange: PropTypes.func,
};

TimezonePicker.defaultProps = {
  onTimezoneChange: () => {},
};

export default TimezonePicker;
