import momentLocalize from "moment"
import moment from "moment-timezone"
import React, { useEffect, useState } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import styled from "styled-components"
import CommonPageStyles from "../components/BaseComponents/CommonPageStyles"
import HeadingWithButtonContainer from "../components/BaseComponents/HeadingWithButtonContainer"
import Layout from "../components/layout"
import TimezoneEditionModal from "../components/TimezoneEditionModal"
import useAPI from "../hooks/useAPI"
import useDisplayEdition from "../hooks/useDisplayEdition"
import useEventTime from "../hooks/useEventTime"
import useTimezone from "../hooks/useTimezone"
import { growOverParentPadding, media } from "../styles"
// import useValidateRegistration from '../hooks/useValidateRegistration';
import Fa from "../utils/fontawesome"
import AbstractModal from "./abstract-browser/components/AbstractModal"

// -- CONSTANTS
const localizer = momentLocalizer(momentLocalize)

const resourceMap = [
  { track: "stage", resourceTitle: "Stage" },
  { track: "room 1", resourceTitle: "Room 1" },
  { track: "room 2", resourceTitle: "Room 2" },
  { track: "room 3", resourceTitle: "Room 3" },
  { track: "room 4", resourceTitle: "Room 4" },
  { track: "room 5", resourceTitle: "Room 5" },
  { track: "room 6", resourceTitle: "Room 6" },
  { track: "room 7", resourceTitle: "Room 7" },
  { track: "room 8", resourceTitle: "Room 8" },
  { track: "room 9", resourceTitle: "Room 9" },
]

const talkFormatLabelColors = {
  "Interactive talk": "#d0f0fd",
  "Traditional talk": "#d1f7c4",
  "Keynote Event": "#fcb301",
  "Special Event": "#f82a60",
}

// -- FUNCTIONS
const getColorOfTalkFormat = talkFormat => talkFormatLabelColors[talkFormat]

// -- COMPONENTS
const BoldText = styled.span`
  font-weight: bold;
`

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
`

// handle convert datatime
const handleConvertDatetime = (data, tz) => {
  let minT
  let maxT
  const converted = data.map(({ starttime, endtime, ...rest }, ind) => {
    // there is a situation where start time and end time is in different day
    // we should handle this by splitting that into 2 events and add to label (continue)
    // endtime of the first split is cut to 00:00 and the same goes with starttime of the other
    const convertedStart = new Date(
      moment
        .utc(starttime)
        .tz(tz)
        .format("MMM DD, YYYY HH:mm")
    )
    const convertedEnd = new Date(
      moment
        .utc(endtime)
        .tz(tz)
        .format("MMM DD, YYYY HH:mm")
    )

    // console.log('convertedStart', convertedStart)
    // console.log('convertedEnd', convertedEnd)

    if (ind === 0) {
      minT = convertedStart
    }

    if (ind === data.length - 1) {
      maxT = convertedEnd
    }

    return {
      start: convertedStart,
      end: convertedEnd,
      allDay: false,
      // passthrough modal
      starttime,
      endtime,
      ...rest,
    }
  })

  return {
    converted,
    minT,
    maxT,
  }
}

// need to make this a curry function to pass eventTimeBoundary in
const CustomBar = eventTimeBoundary => ({
  // eslint-disable-next-line react/prop-types
  onNavigate,
  label,
  date,
}) => {
  if (!eventTimeBoundary) {
    return null
  }

  // console.log('in CustomBar bound0/date/bound1', eventTimeBoundary[0], date, eventTimeBoundary[1])

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        {date >= eventTimeBoundary[0] ? (
          <button type="button" onClick={() => onNavigate("PREV")}>
            &lt;
          </button>
        ) : null}
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        {date <= eventTimeBoundary[1] ? (
          <button type="button" onClick={() => onNavigate("NEXT")}>
            &gt;
          </button>
        ) : null}
      </span>
    </div>
  )
}

// -- PAGE component
export default () => {
  const { getAgenda } = useAPI()
  // agenda
  // default value is always the last element of editionOptions
  // add more edition in editionOptions and default will be changed
  const { currentEdition, currentEditionName } = useEventTime()
  const [displayEdition, setDisplayEdition] = useState({
    label: currentEditionName,
    value: currentEdition,
  })
  const { mainConfMetadata } = useDisplayEdition(displayEdition.value)
  const {
    text: mainConfDateText,
    start: mainConfStartDate,
    end: mainConfEndDate,
    eventTimeBoundary,
  } = mainConfMetadata
  const [isLoading, setIsLoading] = useState(true)
  const [agendaData, setAgendaData] = useState([])
  const [tzAgendaData, setTzAgendaData] = useState([])
  const { timezone } = useTimezone()

  // calendar related states
  // this is a moment object, used to fetch data
  // const [currentDate, setCurrentDate] = useState(null);
  const [currentDateToFetch, setCurrentDateToFetch] = useState(null)
  // this is a Date object, used to set calendar date title
  // const [defaultDate, setDefaultDate] = useState(null);
  const [currentDateForCalendar, setCurrentDateForCalendar] = useState(null)
  // this is time boundary for each day one the calendar
  // const [currentISODate, setCurrentISODate] = useState(new Date('October 26, 2020').toISOString())
  const [minTime, setMinTime] = useState(undefined)
  const [maxTime, setMaxTime] = useState(undefined)

  // modal visibility status and data to be displayed on modal
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [pressedItemData, setPressedItemData] = useState(null)

  // initiate date for both calendar and fetcher
  useEffect(() => {
    if (!eventTimeBoundary) {
      return
    }

    const tzStartDate = moment.tz(mainConfStartDate, "MMMM DD, YYYY", timezone)
    tzStartDate.set("h", 0)
    tzStartDate.set("m", 0)

    setCurrentDateForCalendar(new Date(tzStartDate.toISOString()))
    setCurrentDateToFetch(tzStartDate)
  }, [eventTimeBoundary, mainConfStartDate, timezone])

  // fetch data in this effect
  useEffect(() => {
    if (!currentDateToFetch) {
      return
    }

    setIsLoading(true)
    getAgenda({
      edition: displayEdition.value,
      starttime: encodeURIComponent(currentDateToFetch.toISOString()),
    })
      .then(res => res.json())
      .then(resJson => {
        setAgendaData(resJson.data)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err)
      })
  }, [currentDateToFetch, displayEdition.value, getAgenda, timezone])

  // handle fetched data by adding timezone into each object
  useEffect(() => {
    const { converted, minT, maxT } = handleConvertDatetime(
      agendaData,
      timezone
    )

    setTzAgendaData(converted)

    if (minT || maxT) {
      setMinTime(minT)
      setMaxTime(maxT)
    } else {
      const tzEndDate = moment.tz(mainConfEndDate, "MMMM DD, YYYY", timezone)
      tzEndDate.set("h", 0)
      tzEndDate.set("m", 0)
      setMinTime(new Date(tzEndDate.toISOString()))
      tzEndDate.set("m", 1)
      setMaxTime(new Date(tzEndDate.toISOString()))
    }
  }, [agendaData, mainConfEndDate, timezone])

  useEffect(() => {
    console.log("tzAgendaData", tzAgendaData)
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
            onEditionChange={edition => {
              setDisplayEdition(edition)
            }}
          />
        </HeadingWithButtonContainer>
        <p>
          Join our conference via Zoom Webinar, Crowdcast, and YouTube. If you
          sign up and opt-in to the mindmatching, you will be automatically
          matched with 6 other scientists working in related areas for
          one-to-one communication. You can find them in your matches tab under
          your profile before the conference.
        </p>
        <h3>Main Conference</h3>
        <p>
          The main conference will be happening on{" "}
          <BoldText>{mainConfDateText}</BoldText> (starts at midnight GMT)
          followed by mind-matching session if you opt-in to participate. The
          main talks will happen in parallel on Zoom Webinar. The sessions will
          always be on and function as a lobby during short talks.
        </p>
        <ul>
          <li>
            <b>Usage</b>
            {" · "}
            Please select timezone based on your location or preferred timezone
            in the top-right corner. The time on agenda will be updated
            according to your chosen location. You can click each event to
            access event details and <Fa icon={["far", "calendar-plus"]} />
            {" to add to Google calendar. "}
            When you expand, you will also see links to Zoom (
            <Fa icon="chalkboard-teacher" />
            ). There are one stage and 9 rooms.{" "}
            <b>
              If you change the timezone, please change the date to refresh this
              calendar view.
            </b>{" "}
          </li>
          <li>
            <b>More Details</b>
            {" · "}
            We also provide search engine, personal schedule, and recommendation
            engine on our{" "}
            <a href="https://neuromatch.io/abstract-browser">
              Abstract Browser page
            </a>
          </li>
        </ul>
        {isLoading ? (
          <p css="text-align: center;">
            Now loading... <Fa icon="sync" spin />
          </p>
        ) : null}
        {tzAgendaData.length === 0 && !isLoading ? (
          <p
            css={`
              text-align: center;
              border: 2px solid rgb(248, 42, 96);
              padding: 12px 0;
            `}
          >
            There are no events on this day <Fa icon="bullhorn" />
          </p>
        ) : null}
        {currentDateForCalendar ? (
          <BigCalendarContainer>
            <Calendar
              localizer={localizer}
              events={tzAgendaData}
              defaultView={Views.DAY}
              views={["day"]}
              step={5}
              timeslots={2}
              date={currentDateForCalendar}
              resources={resourceMap}
              resourceAccessor="track"
              resourceIdAccessor="track"
              resourceTitleAccessor="resourceTitle"
              eventPropGetter={event => ({
                style: {
                  borderLeftWidth: "4px",
                  borderLeftColor: getColorOfTalkFormat(event.talk_format),
                },
              })}
              onNavigate={date => {
                const tzDate = moment.tz(date, timezone)
                tzDate.set("h", 0)
                tzDate.set("m", 0)

                setCurrentDateForCalendar(date)
                setCurrentDateToFetch(tzDate)
              }}
              components={{
                toolbar: CustomBar(eventTimeBoundary),
              }}
              min={minTime}
              max={maxTime}
              onSelectEvent={selectedEvent => {
                setDetailModalVisible(true)
                setPressedItemData(selectedEvent)
              }}
            />
          </BigCalendarContainer>
        ) : null}
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
  )
}
