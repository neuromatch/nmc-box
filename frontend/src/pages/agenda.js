import { Link } from 'gatsby';
import momentLocalize from 'moment';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCookies } from 'react-cookie';
import Select from 'react-select';
import styled from 'styled-components';
import CommonPageStyles from '../components/BaseComponents/CommonPageStyles';
import Layout from '../components/layout';
import useSiteMetadata from '../hooks/gql/useSiteMetadata';
import { fetchGet, useFetchGet } from '../hooks/useFetch';
// import useValidateRegistration from '../hooks/useValidateRegistration';
import Fa from '../utils/fontawesome';
import { media, growOverParentPadding } from '../styles';
import { AgendaInADay, StyledTable } from '../components/AgendaComponents';
import AbstractModal from './abstract-browser/components/AbstractModal';
import HeadingWithButtonContainer from '../components/BaseComponents/HeadingWithButtonContainer';

// -- CONSTANTS
const localizer = momentLocalizer(momentLocalize);

const timeZoneCookieKey = 'timezone';

const resourceMap = [
  { track: 'stage', resourceTitle: 'Stage' },
  { track: 'room 1', resourceTitle: 'Room 1' },
  { track: 'room 2', resourceTitle: 'Room 2' },
  { track: 'room 3', resourceTitle: 'Room 3' },
  { track: 'room 4', resourceTitle: 'Room 4' },
  { track: 'room 5', resourceTitle: 'Room 5' },
  { track: 'room 6', resourceTitle: 'Room 6' },
  { track: 'room 7', resourceTitle: 'Room 7' },
  { track: 'room 8', resourceTitle: 'Room 8' },
  { track: 'room 9', resourceTitle: 'Room 9' },
];

const editionOptions = [
  { label: '1.0', value: '2020-1' },
  { label: '2.0', value: '2020-2' },
  { label: '3.0', value: '2020-3' },
];

const timeBoundary = [
  new Date('October 25, 2020 12:00'),
  new Date('October 31, 2020 12:00'),
];

const timeZoneOptions = moment.tz.names()
  .filter((n) => n.includes('/')) // only those have /
  .map((n) => ({
    label: n.replace(/_/g, ' '),
    value: n,
  }));

// guess user timezone
const defaultGuessZone = moment.tz.guess();

const talkFormatLabelColors = {
  'Interactive talk': '#d0f0fd',
  'Traditional talk': '#d1f7c4',
  'Keynote Event': '#fcb301',
  'Special Event': '#f82a60',
};

// -- FUNCTIONS
const getColorOfTalkFormat = (talkFormat) => talkFormatLabelColors[talkFormat];

// -- COMPONENTS
const BoldText = styled.span`
  font-weight: bold;
`;

const BigCalendarContainer = styled.div`
  .rbc-allday-cell {
    display: none;
  }
  .rbc-time-view .rbc-header {
    border-bottom: none;
  }
  /* hide time on card to create more space */
  .rbc-event-label {
    display: none;
  }
  /* adjust event font size */
  .rbc-event-content {
    font-size: 0.675em;
  }
  /* reset event color */
  .rbc-day-slot {
    .rbc-event {
      background-color: white;
      color: #333333;
      border: 1px solid #ccc;
    }
  }
  /* styling label */
  .rbc-toolbar {
    .rbc-toolbar-label {
      font-size: 1.5em;
      font-weight: bold;

      flex-grow: 0;
      padding-left: 20px;
      padding-right: 20px;

      ${media.extraSmall`
        padding-left: 10px;
        padding-right: 10px;
      `}
    }
  }

  ${growOverParentPadding(96)}
`;

// handle convert datatime
const handleConvertDatetime = (data, tz) => {
  let minT;
  let maxT;
  const converted = data.map(({
    starttime, endtime, ...rest
  }, ind) => {
    // there is a situation where start time and end time is in different day
    // we should handle this by splitting that into 2 events and add to label (continue)
    // endtime of the first split is cut to 00:00 and the same goes with starttime of the other
    const convertedStart = new Date(moment.utc(starttime).tz(tz).format('MMM DD, YYYY HH:mm'));
    const convertedEnd = new Date(moment.utc(endtime).tz(tz).format('MMM DD, YYYY HH:mm'));

    if (ind === 0) {
      minT = convertedStart;
    }

    if (ind === data.length - 1) {
      maxT = convertedEnd;
    }

    return ({
      start: convertedStart,
      end: convertedEnd,
      allDay: false,
      // passthrough modal
      starttime,
      endtime,
      ...rest,
    });
  });

  return {
    converted,
    minT,
    maxT,
  };
};

const CustomBar = ({
  // eslint-disable-next-line react/prop-types
  onNavigate, label, date,
}) => (
  <div className="rbc-toolbar">
    <span className="rbc-btn-group">
      {date >= timeBoundary[0]
        ? (
          <button
            type="button"
            onClick={() => onNavigate('PREV')}
          >
            &lt;
          </button>
        )
        : null}
    </span>
    <span className="rbc-toolbar-label">{label}</span>
    <span className="rbc-btn-group">
      {date <= timeBoundary[1]
        ? (
          <button
            type="button"
            onClick={() => onNavigate('NEXT')}
          >
            &gt;
          </button>
        )
        : null}
    </span>
  </div>
);

// -- PAGE component
export default () => {
  // idToken is for debounce fetch for search
  // const { isLoggedIn, idToken } = useValidateRegistration();

  // agenda
  // default value is always the last element of editionOptions
  // add more edition in editionOptions and default will be changed
  const [displayEdition, setDisplayEdition] = useState(editionOptions[editionOptions.length - 1]);
  const [isLoading, setIsLoading] = useState(true);
  const agendaData = []
  const isLoadingAgenda = false
  // const { result: agendaData, isLoading: isLoadingAgenda } = useFetchGet(
  //   `/api/get_agenda?edition=${displayEdition.value}`,
  //   [],
  // );

  // timezone and cookies
  const [cookies, setCookie] = useCookies([timeZoneCookieKey]);
  const [timeZone, setTimeZone] = useState(
    cookies[timeZoneCookieKey] || defaultGuessZone,
  );

  // agenda data of the current timezone
  const [defaultDate, setDefaultDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [minTime, setMinTime] = useState(undefined);
  const [maxTime, setMaxTime] = useState(undefined);
  const [tzAgendaData, setTzAgendaData] = useState([]);
  const [tzAgendaData3Up, setTzAgendaData3Up] = useState([]);

  // modal visibility status and data to be displayed on modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [pressedItemData, setPressedItemData] = useState(null);

  useEffect(() => {
    const now = new Date();

    if (now > timeBoundary[0] && now < timeBoundary[1]) {
      const tmp = `${now.toISOString().slice(0, -13)}00:00:00`;
      setDefaultDate(new Date(tmp));
      setCurrentDate(moment.tz(tmp, timeZone));
    } else {
      setDefaultDate(new Date('October 26, 2020 00:00'));
      setCurrentDate(moment.tz('2020-10-26T00:00:00', timeZone));
    }
  }, []);

  // side effect for older versions
  useEffect(() => {
    if (displayEdition.value === '2020-3') {
      return;
    }

    // update isLoading
    setIsLoading(isLoadingAgenda);

    // convert agenda data to timezone
    setTzAgendaData(
      agendaData.reduce((acc, cur) => {
        // parse datetime from json, base timezone is America/New_York
        const edtDatetime = moment.tz(
          cur.datetime_edt,
          'YYYY-MM-DD HH:mm:ss',
          'America/New_York',
        );

        // get target datetime based on user selected timezone
        const targetDatetime = edtDatetime.tz(timeZone);
        // get date part of selected timezone to be grouped
        const targetDate = targetDatetime.format('MMMM DD, YYYY');
        // check if there is already a group of current date
        const targetInd = acc.findIndex(({ date }) => date === targetDate);

        // if no group already, create a new one
        // also add tzTime which is a time of target timezone
        if (targetInd === -1) {
          return [
            ...acc,
            {
              date: targetDate,
              data: [
                {
                  ...cur,
                  tzTime: targetDatetime.format('hh:mm a'),
                },
              ],
            },
          ];
        }

        // if there is already a group, push current obj into the data array
        acc[targetInd].data.push({
          ...cur,
          tzTime: targetDatetime.format('hh:mm a'),
        });

        return [
          ...acc,
        ];
      }, []),
    );
  }, [agendaData, timeZone, isLoadingAgenda, displayEdition.value]);

  // // side effect for v3.0+
  // useEffect(() => {
  //   if (displayEdition.value !== '2020-3' || currentDate === null) {
  //     return;
  //   }

  //   fetchGet(
  //     undefined,
  //     `/api/get_all_submissions_agenda?starttime=${encodeURIComponent(currentDate.toISOString())}`,
  //     () => {
  //       setIsLoading(true);
  //     },
  //     (resJson) => {
  //       const { converted, minT, maxT } = handleConvertDatetime(resJson, timeZone);
  //       setTzAgendaData3Up(converted);

  //       if (minT || maxT) {
  //         setMinTime(minT);
  //         setMaxTime(maxT);
  //       } else {
  //         // reduce calendar height when there are no events
  //         setMinTime(new Date('Oct 31, 2020 00:00'));
  //         setMaxTime(new Date('Oct 31, 2020 00:01'));
  //       }
  //     },
  //     () => {},
  //     () => {
  //       setIsLoading(false);
  //     },
  //   );
  // }, [currentDate, displayEdition.value, timeZone]);

  // metadata
  const {
    mainConfDate,
  } = useSiteMetadata(displayEdition.value);

  return (
    <Layout>
      <AbstractModal
        data={pressedItemData}
        visible={detailModalVisible}
        handleClickClose={() => setDetailModalVisible(false)}
        timezone={timeZone}
      />
      <CommonPageStyles>
        <HeadingWithButtonContainer>
          <h2>Agenda</h2>
          <div>
            <Select
              css={`
                min-width: 80px;
              `}
              options={editionOptions}
              defaultValue={displayEdition}
              components={{
                IndicatorSeparator: () => null,
              }}
              onChange={(x) => setDisplayEdition(x)}
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
        </HeadingWithButtonContainer>
        <p>
          Join our conference via Zoom Webinar and
          {' '}
          <a href="https://www.youtube.com/channel/UCcBKrxkfNv04R9PXLovjf5w/featured">
            YouTube
          </a>
          . If you sign up and opt-in to the mind matching part,
          you will be automatically matched with 6 other
          scientists working in related areas for one-to-one communication
          You will get list of
          {' '}
          <Link to="/your-matches">your matches</Link>
          {' '}
          tab under your profile after the conference.
        </p>
        <HeadingWithButtonContainer
          css={`
            ${media.medium`
              display: block;

              h3 {
                margin-bottom: 0.5em;
              }
            `}
          `}
        >
          <h3>Main Conference</h3>
          <div>
            <Select
              css={`
                min-width: 200px;
                font-size: 0.8rem;
              `}
              options={timeZoneOptions}
              defaultValue={timeZoneOptions.find(({ value }) => value === timeZone)}
              onChange={(x) => {
                setTimeZone(x.value);
                setCookie(timeZoneCookieKey, x.value);
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
          </div>
        </HeadingWithButtonContainer>
        <p>
          The main conference will be happening on
          {' '}
          <BoldText>{mainConfDate}</BoldText>
          {' '}
          (starts at midnight GMT) followed by mind-matching session if
          you opt-in to participate. The main talks will happen in parallel
          on Zoom Webinar. The sessions will always be on and function as a
          lobby during short talks.
        </p>
        <ul>
          <li>
            <b>Usage</b>
            {' · '}
            Please select timezone based on your location or preferred timezone
            in the top-right corner. The time on agenda will be updated according
            to your chosen location. You can click each event to access
            event details and
            {' '}
            <Fa icon={['far', 'calendar-plus']} />
            {' to add to Google calendar. '}
            When you expand, you will also see links to Zoom (
            <Fa icon="chalkboard-teacher" />
            ).
            {' '}
            There are one stage and 9 rooms.
            {' '}
            <b>
              If you change the timezone, please change
              the date to refresh this calendar view.
            </b>
            {' '}
          </li>
          <li>
            <b>More Details</b>
            {' · '}
            We also provide search engine, personal schedule, and
            recommendation engine on our
            {' '}
            <a href="https://neuromatch.io/abstract-browser">
              Abstract Browser page
            </a>
          </li>
          <li>
            <b>Backup</b>
            {' · '}
            If the view below does not work, please look for information on
            {' '}
            <a href="https://neural-reckoning.github.io/nmc3_provisional_schedule">
              NMC3 Provisional Schedule by Neural Reckoning Group.
            </a>
          </li>
        </ul>
        {isLoading
          ? (
            <p css="text-align: center;">
              Now loading...
              {' '}
              <Fa icon="sync" spin />
            </p>
          )
          : null}
        {displayEdition.value !== '2020-3'
          ? tzAgendaData.length === 0
            ? (
              <p css="text-align: center;">
                Agenda coming soon!
                {' '}
                <Fa icon="bullhorn" />
              </p>
            )
            : (
              <StyledTable>
                {tzAgendaData.map((x) => (
                  <AgendaInADay
                    key={x.date}
                    date={x.date}
                    data={x.data}
                  />
                ))}
              </StyledTable>
            )
          : (
            <>
              {tzAgendaData3Up.length === 0 && !isLoading
                ? (
                  <p
                    css={`
                      text-align: center;
                      border: 2px solid rgb(248, 42, 96);
                      padding: 12px 0;
                    `}
                  >
                    There are no events on this day
                    {' '}
                    <Fa icon="bullhorn" />
                  </p>
                )
                : null}
              {defaultDate
                ? (
                  <BigCalendarContainer>
                    <Calendar
                      localizer={localizer}
                      events={tzAgendaData3Up}
                      defaultView={Views.DAY}
                      views={['day']}
                      step={5}
                      timeslots={2}
                      defaultDate={defaultDate}
                      resources={resourceMap}
                      resourceAccessor="track"
                      resourceIdAccessor="track"
                      resourceTitleAccessor="resourceTitle"
                      eventPropGetter={(event) => ({
                        style: {
                          borderLeftWidth: '4px',
                          borderLeftColor: getColorOfTalkFormat(event.talk_format),
                        },
                      })}
                      onNavigate={(date) => {
                        let toGoDate = '';

                        // date is a Date() instance embedded with machine timezone
                        // we need to completely override it
                        toGoDate += `${date.getFullYear()}-`;
                        toGoDate += `${date.getMonth() + 1}-`;
                        toGoDate += `${date.getDate()}T`;
                        toGoDate += '00:00:00';

                        setCurrentDate(moment.tz(toGoDate, timeZone));
                      }}
                      components={{
                        toolbar: CustomBar,
                      }}
                      min={minTime}
                      max={maxTime}
                      onSelectEvent={(selectedEvent) => {
                        setDetailModalVisible(true);
                        setPressedItemData(selectedEvent);
                      }}
                    />
                  </BigCalendarContainer>
                )
                : null}
            </>
          )}
      </CommonPageStyles>
    </Layout>
  );
};
