import { Link } from 'gatsby';
import momentLocalize from 'moment';
import moment from 'moment-timezone';
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
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
import useTimezone from '../hooks/useTimezone';
import useEventTime from '../hooks/useEventTime';
import TimezoneEditionModal from '../components/TimezoneEditionModal';
import useAPI from '../hooks/useAPI';
import useDisplayEdition from '../hooks/useDisplayEdition';

// -- CONSTANTS
const localizer = momentLocalizer(momentLocalize);

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

    // console.log('convertedStart', convertedStart)
    // console.log('convertedEnd', convertedEnd)

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

// need to make this a curry function to pass eventTimeBoundary in
const CustomBar = (eventTimeBoundary) => ({
  // eslint-disable-next-line react/prop-types
  onNavigate, label, date,
}) => {
  if (!eventTimeBoundary) {
    return null
  }

  // console.log('in CustomBar bound0/date/bound1', eventTimeBoundary[0], date, eventTimeBoundary[1])

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        {date >= eventTimeBoundary[0]
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
        {date <= eventTimeBoundary[1]
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
  )
};

// -- PAGE component
export default () => {
  const { getAgenda } = useAPI()
  // agenda
  // default value is always the last element of editionOptions
  // add more edition in editionOptions and default will be changed
  const { currentEdition ,currentEditionName } = useEventTime()
  const [displayEdition, setDisplayEdition] = useState({ label: currentEditionName, value: currentEdition })
  const { mainConfMetadata } = useDisplayEdition(displayEdition.value);
  const { text: mainConfDateText, start: mainConfStartDate, eventTimeBoundary } = mainConfMetadata
  // metadata
  // const { mainConfDate } = useSiteMetadata(currentEdition);
  const [isLoading, setIsLoading] = useState(true);
  const [agendaData, setAgendaData] = useState([]);
  const [tzAgendaData, setTzAgendaData] = useState([]);
  const { timezone } = useTimezone();

  // calendar related states
  // this is a moment object, used to fetch data
  // const [currentDate, setCurrentDate] = useState(null);
  const [currentDateToFetch, setCurrentDateToFetch] = useState(null);
  // this is a Date object, used to set calendar date title
  // const [defaultDate, setDefaultDate] = useState(null);
  const [currentDateForCalendar, setCurrentDateForCalendar] = useState(null);
  // this is time boundary for each day one the calendar
  // const [currentISODate, setCurrentISODate] = useState(new Date('October 26, 2020').toISOString())
  const [minTime, setMinTime] = useState(undefined);
  const [maxTime, setMaxTime] = useState(undefined);

  // modal visibility status and data to be displayed on modal
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [pressedItemData, setPressedItemData] = useState(null);

  // idToken is for debounce fetch for search
  // const { isLoggedIn, idToken } = useValidateRegistration();
  // const [displayEdition, setDisplayEdition] = useState(currentEdition);
  // const [isLoading, setIsLoading] = useState(true);
  // const agendaData = []
  // const isLoadingAgenda = false
  // const { result: agendaData, isLoading: isLoadingAgenda } = useFetchGet(
  //   `/api/get_agenda?edition=${displayEdition.value}`,
  //   [],
  // );

  // timezone and cookies
  // const [cookies, setCookie] = useCookies([timeZoneCookieKey]);
  // const [timeZone, setTimeZone] = useState(
  //   cookies[timeZoneCookieKey] || defaultGuessZone,
  // );

  // const [tzAgendaData, setTzAgendaData] = useState([]);
  const [tzAgendaData3Up, setTzAgendaData3Up] = useState([]);

  // TODO:
  // this effect checks if today is in between conference dates or not
  // if in set default/current date as today, if not set as first day of the event
  useEffect(() => {
    if (!eventTimeBoundary) {
      return
    }

    const now = new Date();

    if (now > eventTimeBoundary[0] && now < eventTimeBoundary[1]) {
      console.log('--------- if')

      const tmp = `${now.toISOString().slice(0, -13)}00:00:00`;
      setCurrentDateForCalendar(new Date(tmp))
      setCurrentDateToFetch(moment.tz(new Date(tmp), timezone))
      // setDefaultDate(new Date(tmp));
      // setCurrentDate(moment.tz(tmp, timezone));
    } else {
      console.log('--------- else', moment.tz(new Date(`${mainConfStartDate} 00:00z`), timezone))

      setCurrentDateForCalendar(new Date(`${mainConfStartDate} 00:00`))
      setCurrentDateToFetch(moment.tz(new Date(`${mainConfStartDate} 00:00`), timezone))
      // setDefaultDate(new Date('October 26, 2020 00:00'));
      // setCurrentDate(moment.tz('2020-10-26T00:00:00', timezone));
    }
  }, [eventTimeBoundary, mainConfStartDate, timezone]);

  useEffect(() => {
    console.log('mainConferenceMetadata', mainConfMetadata)
    console.log('eventTimeBoundary', eventTimeBoundary)
  }, [mainConfMetadata, eventTimeBoundary])

  // side effect for older versions
  // useEffect(() => {
  //   if (displayEdition.value === '2020-3') {
  //     return;
  //   }

  //   // update isLoading
  //   setIsLoading(isLoadingAgenda);

  //   // convert agenda data to timezone
  //   setTzAgendaData(
  //     agendaData.reduce((acc, cur) => {
  //       // parse datetime from json, base timezone is America/New_York
  //       const edtDatetime = moment.tz(
  //         cur.datetime_edt,
  //         'YYYY-MM-DD HH:mm:ss',
  //         'America/New_York',
  //       );

  //       // get target datetime based on user selected timezone
  //       const targetDatetime = edtDatetime.tz(timezone);
  //       // get date part of selected timezone to be grouped
  //       const targetDate = targetDatetime.format('MMMM DD, YYYY');
  //       // check if there is already a group of current date
  //       const targetInd = acc.findIndex(({ date }) => date === targetDate);

  //       // if no group already, create a new one
  //       // also add tzTime which is a time of target timezone
  //       if (targetInd === -1) {
  //         return [
  //           ...acc,
  //           {
  //             date: targetDate,
  //             data: [
  //               {
  //                 ...cur,
  //                 tzTime: targetDatetime.format('hh:mm a'),
  //               },
  //             ],
  //           },
  //         ];
  //       }

  //       // if there is already a group, push current obj into the data array
  //       acc[targetInd].data.push({
  //         ...cur,
  //         tzTime: targetDatetime.format('hh:mm a'),
  //       });

  //       return [
  //         ...acc,
  //       ];
  //     }, []),
  //   );
  // }, [agendaData, timezone, isLoadingAgenda, displayEdition.value]);





  // this effect fetch agenda data for all version now
  useEffect(() => {
    if (!currentDateToFetch) {
      return
    }

    // if (displayEdition.value !== '2020-3' || currentDate === null) {
    //   return;
    // }
    //

    setIsLoading(true)

    // fetch data from the server
    getAgenda({
      edition: displayEdition.value,
      starttime: encodeURIComponent(currentDateToFetch.toISOString()),
    })
      .then(res => res.json())
      .then(resJson => {
        setAgendaData(resJson.data)
        setIsLoading(false)
      })
      .catch(err => console.log(err))

    // fetchGet(
    //   undefined,
    //   `/api/get_all_submissions_agenda?starttime=${encodeURIComponent(currentDate.toISOString())}`,
    //   () => {
    //     setIsLoading(true);
    //   },
    //   (resJson) => {
    //     const { converted, minT, maxT } = handleConvertDatetime(resJson, timeZone);
    //     setTzAgendaData3Up(converted);

    //     if (minT || maxT) {
    //       setMinTime(minT);
    //       setMaxTime(maxT);
    //     } else {
    //       // reduce calendar height when there are no events
    //       setMinTime(new Date('Oct 31, 2020 00:00'));
    //       setMaxTime(new Date('Oct 31, 2020 00:01'));
    //     }
    //   },
    //   () => {},
    //   () => {
    //     setIsLoading(false);
    //   },
    // );
  }, [currentDateToFetch, displayEdition.value, getAgenda, timezone]);

  useEffect(() => {
    const { converted, minT, maxT } = handleConvertDatetime(agendaData, timezone);

    // console.log('minT, maxT', minT, maxT);

    setTzAgendaData(converted)

    if (minT || maxT) {
      setMinTime(minT);
      setMaxTime(maxT);
    } else {
      // TODO: replace static date here
      // reduce calendar height when there are no events
      setMinTime(new Date('Oct 31, 2020 00:00'));
      setMaxTime(new Date('Oct 31, 2020 00:01'));
    }
  }, [agendaData, timezone])

  useEffect(() => {
    console.log('tzAgendaData', tzAgendaData)
  }, [tzAgendaData])

  return (
    <Layout>
      <AbstractModal
        data={pressedItemData}
        visible={detailModalVisible}
        handleClickClose={() => setDetailModalVisible(false)}
        timezone={timezone}
      />
      <CommonPageStyles>
        <HeadingWithButtonContainer>
          <h2>Agenda</h2>
          <TimezoneEditionModal
            editionValue={displayEdition}
            onEditionChange={(edition) => { setDisplayEdition(edition) }}
          />
        </HeadingWithButtonContainer>
        <p>
          Join our conference via Zoom Webinar, Crowdcast,
          and YouTube. If you sign up and opt-in to the mindmatching,
          you will be automatically matched with 6 other
          scientists working in related areas for one-to-one
          communication. You can find them in your matches
          tab under your profile before the conference.
        </p>
        <h3>Main Conference</h3>
        <p>
          The main conference will be happening on
          {' '}
          <BoldText>{mainConfDateText}</BoldText>
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
        {tzAgendaData.length === 0 && !isLoading
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
        {currentDateForCalendar
          ? (
            <BigCalendarContainer>
              <Calendar
                localizer={localizer}
                events={tzAgendaData}
                defaultView={Views.DAY}
                views={['day']}
                step={5}
                timeslots={2}
                // defaultDate={currentDateForCalendar}
                date={currentDateForCalendar}
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
                  console.log('date', date);
                  // date is a Date() instance embedded with machine timezone
                  // we need to completely override it
                  const tmp = `${date.toISOString().slice(0, -13)}00:00:00`;

                  // setCurrentDate(moment.tz(toGoDate, timezone));
                  setCurrentDateForCalendar(date)
                  setCurrentDateToFetch(moment.tz(date.toISOString(), timezone))
                }}
                components={{
                  toolbar: CustomBar(eventTimeBoundary),
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
        {/* {currentEdition !== '2020-3'
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

                        setCurrentDate(moment.tz(toGoDate, timezone));
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
          )} */}
      </CommonPageStyles>
    </Layout>
  );
};
