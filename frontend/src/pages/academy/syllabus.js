import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import ReactMarkdown from 'react-markdown';
import Select from 'react-select';
import styled from 'styled-components';
import CommonPageStyles from '../../components/BaseComponents/CommonPageStyles';
import { TextWithButtonsWrapper } from '../../components/FormComponents/StyledFormComponents';
import { AcademyLayout } from '../../components/layout';
import useAcademySyllabus from '../../hooks/gql/useAcademySyllabus';
import { Key } from '../../utils';
import { media, Mixins } from '../../utils/ui';

const timeZoneCookieKey = 'timezone';

/**
 * @typedef slotObject
 * @property {number} slot a number of slot
 * @property {string} shift a string of starting offset. This is inverted of GMT
 *                          because it will be used with Etc/GMT
 * @property {number[]} rangeInclue an array containing a range of timezone to be
 *                                  included in this slot
 *
 * slotMetadata
 * @type {slotObject[]}
 */
const slotMetadata = [
  {
    slot: 1,
    shift: '-7',
    rangeInclude: [6.5, 16],
  },
  {
    slot: 2,
    shift: '+0',
    rangeInclude: [-1.5, 6.5],
  },
  {
    slot: 3,
    shift: '+10',
    rangeInclude: [-16, -1.5],
  },
];

// to check if the current timezone is in range of which slot
const isInRange = (x, range) => (x - range[0] >= 0) && (x - range[1] < 0);
// to get a slot number according to the utc offset
const getSlot = (utcOffset, zonename) => {
  const slot = slotMetadata.find((x) => isInRange(utcOffset / 60, x.rangeInclude));

  // no slot should not happen, this is just to have a report
  if (!slot) {
    console.log(zonename, utcOffset / 60);
  }

  return slot ? slot.slot : '';
};

// get timezone options
// remove Etc/GMTxxx as it causes confusion (flip with GMT)
const timeZoneOptions = moment.tz.names()
  .filter((n) => n.includes('/') && !n.includes('Etc/')) // only those have /
  .map((n) => ({
    label: `[Core ${getSlot(moment.tz(n).utcOffset(), n)}] ${n.replace(/_/g, ' ')}`,
    value: n,
  }));

// get slot options
const slotOptions = slotMetadata.map((obj) => ({
  label: `Core ${obj.slot}`,
  value: obj.slot,
}));

// overwrite style mostly for TextWithButtonsWrapper
const OverwriteStyles = styled(CommonPageStyles)`
  ${TextWithButtonsWrapper} {
    /* display flex to have both select inline */
    & > div {
      display: flex;

      /* in big div contains 2 divs */
      & > div {
        /* for those 2 select in each div, give them space between */
        :not(:last-child) {
          margin-right: 10px;
        }
      }
    }

    /* on small screen */
    ${media.small`
      /* from flex to block, to fill the whole line */
      &, & > div {
        display: block;
      }

      /* give some space between them */
      /* & > div > div is equivalent to '& > div { & > div }' above */
      h2, & > div > div {
        margin-bottom: 0.25em;

        /* reset this extra margin too */
        :not(:last-child) {
          margin-right: 0px;
        }
      }
    `}
  }
`;

const StyledTable = styled.table`
  ${media.small`
    /* grow over parent's padding in small screen */
    ${Mixins.growOverParentPadding(96)}
  `}

  ${media.extraSmall`
    /* this allows only table scroll in smallscreen */
    display: block;
    overflow-x: scroll;
  `}

  border: 1px solid #ccc;

  th {
    border: none;
    padding-left: 0em;
    background-color: #f4f4f4;
    border-bottom: 1px solid #ccc;

    /* padding is removed in layout */
    & {
      padding-left: 1em;
      padding-right: 1em;
    }
  }

  tr {
    :not(:nth-child(odd)) {
      background-color: #f4f4f4;
    }

    td {
      font-size: 0.85em;
      border: none;

      /* control column width */
      &:nth-child(1) {
        width: 190px;
        min-width: 92px;
      }

      &:nth-child(2) {
        width: 280px;
        min-width: 190px;
      }

      &:nth-child(3) {
        min-width: 300px;
      }

      /* padding is removed in layout */
      &:first-child {
        padding-left: 1em;
      }

      &:last-child {
        padding-right: 1em;
      }
    }
  }
`;

const ScheduleInADay = ({
  title, description, datetimeUtc, schedule,
}) => (
  <>
    <h4>{`${moment(datetimeUtc).format('ddd, MMMM D')}: ${title}`}</h4>
    <p>
      <span css="font-weight: bold;">Description</span>
      {' '}
      {description}
    </p>
    <StyledTable>
      <thead>
        <tr>
          <th>
            Time
          </th>
          <th>
            Lecture
          </th>
          <th>
            Details
          </th>
        </tr>
      </thead>
      <tbody>
        {schedule.map((x) => (
          <tr key={Key.getShortKey()}>
            <td valign="top">
              {`${moment(x.starttime).format('hh:mm A')} - ${moment(x.endtime).format('hh:mm A')}`}
            </td>
            <td valign="top">
              <ReactMarkdown css="p { margin: 0 }" source={x.lecture} />
            </td>
            <td valign="top">
              <ReactMarkdown css="p { margin: 0 }" source={x.details} />
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  </>
);

ScheduleInADay.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  datetimeUtc: PropTypes.string.isRequired,
  schedule: PropTypes.arrayOf(PropTypes.shape({
    starttime: PropTypes.string,
    endtime: PropTypes.string,
    lecture: PropTypes.string,
    details: PropTypes.string,
  })).isRequired,
};

export default () => {
  // get original syllabus data from JSON
  const syllabusData = useAcademySyllabus();

  // timezone and cookies
  const [cookies, setCookie] = useCookies([timeZoneCookieKey]);

  // ---- GETTING DEFAULTS
  // default timezone is derived from guess()
  const defaultGuessZone = moment.tz.guess();
  // find corresponding option to be used as
  // a defaultValue in Select component
  const defaultTimeZoneValue = timeZoneOptions
    .find(({ value }) => value === (cookies[timeZoneCookieKey] || defaultGuessZone));
  // get default slot from the label of timezone
  const defaultSlot = defaultTimeZoneValue?.label?.match(/\[.*([0-9]+)\]/)[1];
  // and also find default slot option to be used as
  // a defaultValue in Select component
  const defaultSlotValue = slotOptions.find(({ value }) => value === Number(defaultSlot));
  // ----

  const [timeZone, setTimeZone] = useState(
    cookies[timeZoneCookieKey] || defaultGuessZone,
  );
  const [displaySlot, setDisplaySlot] = useState(
    defaultSlotValue ? defaultSlotValue.value : undefined,
  );
  // timezoned data is set in this state
  const [tzSyallabusData, setTzSyallabusData] = useState([]);
  // this is needed to change slot value according to timezone
  const slotSelectRef = useRef(null);

  useEffect(() => {
    // to get timezoned data, we simply map through every obj
    // then if there is a datetime value, we feed into this function
    const getTimezonedString = (dtString) => {
      // first thing to do is to get slot offset (shift)
      // this will tell us how much the starting point of the current slot
      // needs to shift from the UTC
      const slotOffset = slotMetadata.find((x) => x.slot === displaySlot);

      return moment
        // first step parse original time with UTC timezone
        .tz(
          dtString,
          'YYYY-MM-DD HH:mm:ss',
          'UTC',
        )
        // then shift to slot time
        .tz(slotOffset
          ? `Etc/GMT${slotOffset.shift}`
          : 'UTC', true)
        // finally shift to the target timezone
        .tz(timeZone)
        // and send back a string of time
        // this string will be parsed by moment
        // to format again in the component
        .format('YYYY-MM-DD HH:mm:ss');
    };

    // loop through all the data to convert timezone
    setTzSyallabusData(syllabusData.map((weekData) => ({
      ...weekData,
      data: weekData.data.map((eachDayData) => ({
        ...eachDayData,
        datetime_utc: getTimezonedString(eachDayData.datetime_utc),
        schedule: eachDayData.schedule.map((sObj) => ({
          ...sObj,
          starttime: getTimezonedString(sObj.starttime),
          endtime: getTimezonedString(sObj.endtime),
        })),
      })),
    })));
  }, [timeZone, displaySlot, syllabusData]);

  return (
    <AcademyLayout>
      <OverwriteStyles>
        <TextWithButtonsWrapper>
          <h2>Syllabus</h2>
          <div>
            <div>
              <Select
                css={`
                  min-width: 280px;
                `}
                placeholder="Select Timezone.."
                options={timeZoneOptions}
                defaultValue={defaultTimeZoneValue}
                components={{
                  IndicatorSeparator: () => null,
                }}
                onChange={(x) => {
                  // set timezone value to be used for rendering correct time
                  setTimeZone(x.value);
                  setCookie(timeZoneCookieKey, x.value);

                  // get selected slot from label of the timezone
                  const selectedSlot = x.label.match(/\[.*([0-9]+)\]/)[1];
                  setDisplaySlot(selectedSlot);
                  // change value of the slot dropdown
                  slotSelectRef.current.select
                    .setValue(slotOptions
                      .find(({ value }) => value === Number(selectedSlot)));
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
            </div>
            <div>
              <Select
                css={`
                  min-width: 160px;
                `}
                placeholder="Select Slot.."
                options={slotOptions}
                ref={slotSelectRef}
                defaultValue={defaultSlotValue}
                components={{
                  IndicatorSeparator: () => null,
                }}
                onChange={(x) => setDisplaySlot(x.value)}
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
            </div>
          </div>
        </TextWithButtonsWrapper>
        <ul>
          <li>
            <b>Usage</b>
            {' · '}
            Select timezone based on your location. If you want to see different
            timezone schedule options for the other core schedule options,
            use the drop down to pick a different core
          </li>
          <li>
            <b>Note</b>
            {' · '}
            The core that most closely aligns with your timezone is indicated in
            &#91;brackets&#93; in the first drop-down. But you can see other core
            options using the second drop-down, in case you like to stay up late
            or get up early&#33;
          </li>
          <li>
            <b>Objectives</b>
            {' · '}
            Introduce traditional and emerging computational
            neuroscience tools, their complementarity, and what they can tell us
            about the brain. A main focus is on modeling choices, model creation,
            model evaluation and understanding how they relate to biological
            questions.
          </li>
          <li>
            <b>Tutorial microstructure</b>
            {' · '}
            ~10min talk, ~20min tutorial (repeated)
          </li>
          <li>
            <b>Day structure</b>
            {' · '}
            Opening keynote, 3h lecture/tutorial modules, 1h
            interpretation (what did we learn today, what does it mean, underlying
            philosophy, 1h professional development/meta-science, evening group
            projects (for interactive track). There will also be many networking
            activities!
          </li>
          <li>
            <b>Prerequisites</b>
            {' · '}
            <a href="https://github.com/NeuromatchAcademy/precourse">See here</a>
          </li>
        </ul>
        {/* TODO: add syllabus here */}
        {
          tzSyallabusData.length > 0
            ? tzSyallabusData.map((weekObj) => (
              <React.Fragment key={Key.getShortKey()}>
                <h3>{`Week ${weekObj.week}`}</h3>
                {
                  weekObj.data.map((day) => (
                    <ScheduleInADay
                      key={Key.getShortKey()}
                      title={day.title}
                      description={day.description}
                      datetimeUtc={day.datetime_utc}
                      schedule={day.schedule}
                    />
                  ))
                }
              </React.Fragment>
            ))
            : null
        }

        <h3>Networking (throughout) - interactive track only</h3>
        <ul>
          <li>
            Meet a prof about your group&#39;s project
          </li>
          <li>
            Meet a prof about your career
          </li>
          <li>
            Meet a prof about your own project
          </li>
          <li>
            Meet other participants interested in similar topics
          </li>
          <li>
            Meet a group of likeminded people
          </li>
          <li>
            Meet people that are local to you (same city, country)
          </li>
        </ul>

        <h3>Group projects (throughout) - interactive track only</h3>
        <p>
          TBA
        </p>
      </OverwriteStyles>
    </AcademyLayout>
  );
};
