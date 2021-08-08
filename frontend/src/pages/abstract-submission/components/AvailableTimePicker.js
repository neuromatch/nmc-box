import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import TimezonePicker from '../../../components/TimezonePicker';
import useTimezone from '../../../hooks/useTimezone';
import { media } from '../../../styles';

// -- FUNCTIONS
const timezoneParser = (dtStr, tz) => moment.tz(
  dtStr,
  'MMMM DD, YYYY HH:mm',
  tz,
);

// -- CONSTANTS
const datesOptions = [
  'October 25, 2020',
  'October 26, 2020',
  'October 27, 2020',
  'October 28, 2020',
  'October 29, 2020',
  'October 30, 2020',
  'October 31, 2020',
];

const timeOptions = [
  '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
];

const timeBoundary = [
  timezoneParser('October 26, 2020 00:00', 'UTC').toISOString(),
  timezoneParser('October 31, 2020 12:00', 'UTC').toISOString(),
];

// -- COMPONENTS
const Container = styled.div`
  height: auto;
  width: 100%;
`;

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
`;

const GridItem = styled.button.attrs(() => ({
  type: 'button',
  role: 'button',
}))`
  outline: none;
  text-align: center;
  cursor: pointer;

  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;

  p {
    margin: 0;
    font-size: 14px;
  }

  /* handle active */
  ${(p) => p.isActive && css`
    background-color: #22cc22;

    p {
      color: white;
      font-weight: bold;
    }
  `}

  /* handle hover/active */
  ${(p) => !p.isActive && !p.disabled && css`
    :hover {
      background-color: #eee;
    }
    :active {
      background-color: #ccc;
    }
  `}

  /* handle disabled */
  ${(p) => p.disabled && css`
    cursor: default;
    background-color: #eee;
  `}
`;

const DateLabel = styled.p`
  font-size: 14px;
  font-weight: bold;

  margin: 0;
  margin-bottom: 3px;
`;

const EachDateBlock = ({
  date, value, onChange, timezone,
}) => {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    // if value from origin changes, update here too
    setSelected(value);
  }, [value]);

  return (
    <>
      <DateLabel>
        {date}
      </DateLabel>
      <GridContainer>
        {timeOptions.map((time) => {
          const thisOption = {
            label: time,
            value: timezoneParser(`${date} ${time}`, timezone).toISOString(),
          };
          const exist = selected.includes(thisOption.value);

          return (
            <GridItem
              disabled={
                !moment(thisOption.value)
                  .isBetween(timeBoundary[0], timeBoundary[1], undefined, '[)')
              }
              key={thisOption.label}
              isActive={exist}
              onClick={() => {
                let updated;

                if (exist) {
                  updated = selected.filter((sel) => sel !== thisOption.value);
                } else {
                  updated = [
                    ...selected,
                    thisOption.value,
                  ];
                }

                setSelected(updated);
                onChange(updated);
              }}
            >
              <p>{time}</p>
            </GridItem>
          );
        })}
      </GridContainer>
    </>
  );
};

EachDateBlock.propTypes = {
  date: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  timezone: PropTypes.string.isRequired,
};

EachDateBlock.defaultProps = {
  value: [],
  onChange: () => {},
};

// -- MAIN
const AvailableTimePicker = ({
  value,
  onChange,
  onTimezoneChange,
}) => {
  const [selectedDatetime, setSelectedDatetime] = useState(value);
  const { timezone, setTimezone } = useTimezone();

  useEffect(() => {
    // if value from origin changes, update here too
    setSelectedDatetime(value);
  }, [value]);

  return (
    <Container>
      <TimezonePicker
        currentTimezone={timezone}
        onTimezoneChange={(tz) => {
          setTimezone(tz);
          onTimezoneChange(tz);
        }}
      />
      {datesOptions.map((date) => (
        <EachDateBlock
          key={date}
          date={date}
          timezone={timezone}
          value={selectedDatetime.find((x) => x.date === date)?.time || []}
          onChange={(updatedVal) => {
            const exist = selectedDatetime.find((x) => x.date === date);
            const selfInd = selectedDatetime.indexOf(exist);
            let updatedParentVal;

            if (exist) {
              updatedParentVal = [
                ...selectedDatetime.slice(0, selfInd),
                {
                  ...exist,
                  time: updatedVal,
                },
                ...selectedDatetime.slice(selfInd + 1),
              ];
            } else {
              updatedParentVal = [
                ...selectedDatetime,
                {
                  date,
                  time: updatedVal,
                },
              ];
            }

            const filtered = updatedParentVal.filter((x) => x.time.length !== 0);

            setSelectedDatetime(filtered);
            onChange(filtered);
          }}
        />
      ))}
    </Container>
  );
};

AvailableTimePicker.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    time: PropTypes.arrayOf(PropTypes.string),
  })),
  onChange: PropTypes.func,
  onTimezoneChange: PropTypes.func,
};

AvailableTimePicker.defaultProps = {
  value: datesOptions.map((d) => ({ date: d, time: [] })),
  onChange: () => {},
  onTimezoneChange: () => {},
};

export default AvailableTimePicker;
export {
  datesOptions, timeOptions, timezoneParser, timeBoundary,
};
