import { graphql, useStaticQuery } from "gatsby"
import moment from "moment"
import { useEffect, useState } from "react"
import useAPI from "./useAPI"
import useSiteMetadata from "./useSiteMetadata"
import useTimezone, { timezoneParser } from "./useTimezone"

// -- CONSTANTS
// this will generate ["00:00", "01:00", ..., "23.00"]
const timeOptions = Array.from({ length: 24 }).map((_, ind) =>
  ind < 10 ? `0${ind}:00` : `${ind}:00`
)

// -- FUNCTIONS
const getDateRange = (start, end) => {
  const momentStart = moment(start)
  const diff = moment(end).diff(momentStart, "d")
  const range = []
  // first date
  range.push(momentStart.format("MMMM DD, YYYY"))

  for (let i = 0; i < diff; i++) {
    // add one day and push
    momentStart.add(1, "d")
    range.push(momentStart.format("MMMM DD, YYYY"))
  }

  return range
}

// -- MAIN
/**
 * TODO: this hook should include everything about time of the event
 * we may have utils/datetime for parser, converter or something like that.
 *
 * Time of the event should be => start and end time of the first and the last
 * abstract to be presented. We don't really care about the time of the event.
 * Even the AvailableTimePicker should also use the same start and end time
 * as an anchor.
 *
 * In order to get correct startend time, we should get from the backend
 * which will try to get starttime of the first abstract and end time of the
 * last abstract. This has a flaw because at the initial state, the abstracts
 * are not assigned date time.
 *
 * To overcome this, AvailableTimePicker should rely on broad range of the event
 * which is defined manually in config.yml with the main timezone provided.
 *
 * Another problem is default time of AvailableTimePicker. I would say we should
 * set it to 9-18 of the user timezone everyday.
 *
 * Any other places in the application should use time from this hook.
 */
function useEventTime() {
  const { edition } = useSiteMetadata()
  const { getStartEndOfAbstracts } = useAPI()

  const [startEndTime, setStartEnd] = useState({})

  useEffect(() => {
    const getTimePromise = getStartEndOfAbstracts({ edition })

    if (!getTimePromise) {
      return
    }

    getTimePromise
    .then(res => res.json())
    .then(resJson => setStartEnd(resJson))
  }, [edition, getStartEndOfAbstracts])

  useEffect(() => {
    console.log('startEndTime', startEndTime)
  }, [startEndTime])

  const { timezone } = useTimezone()

  const data = useStaticQuery(graphql`
    query availabletime {
      allSitedataYaml {
        edges {
          node {
            id
            current_edition
            main_timezone
            editions {
              edition
              edition_name
              main_conference {
                start
                end
                text
              }
              event_time {
                start
                end
              }
            }
          }
        }
      }
    }
  `)

  const sitedata = data.allSitedataYaml.edges[0].node
  const {
    current_edition: currentEdition,
    editions,
    main_timezone: mainTimezone,
  } = sitedata
  const {
    edition_name: currentEditionName,
    main_conference: { start: startDate, end: endDate },
    event_time: { start: startTime, end: endTime },
  } = editions.find(x => x.edition === currentEdition)

  /**
   * @description this is always ISO strings. It is used to tell start and end time
   * of the latest conference.
   */
  const mainConfTimeBoundary = [
    timezoneParser(`${startDate} ${startTime}`, mainTimezone).toISOString(),
    timezoneParser(`${endDate} ${endTime}`, mainTimezone).toISOString(),
  ]

  // dateRange is used in AvailableTimePicker to generate picker in the range of an event
  const beforeStartDate = moment(new Date(startDate).toISOString())
    .subtract(1, "d")
    .toISOString()
  const afterEndDate = moment(new Date(endDate).toISOString())
    .add(1, "d")
    .toISOString()
  // date range to be used to create options and also default values
  // start -> lower boundary - 1 day
  // end -> upper boundary + 1 day
  // this need padding on both start and end because it depends
  // heavily on the main timezone
  const dateRange = getDateRange(beforeStartDate, afterEndDate)

  // the first time user is about to register, we will pre-select
  // time slots in this period of their timezone in the AvailableTimePicker.
  const presetShouldJoinTime = ["9:00", "18:00"]
  const defaultAvailableTime = dateRange.map(date => {
    const accTime = []

    timeOptions.forEach(time => {
      const thisTime = timezoneParser(`${date} ${time}`, timezone)
      const isBetweenDefault = thisTime.isBetween(
        timezoneParser(`${date} ${presetShouldJoinTime[0]}`, timezone),
        timezoneParser(`${date} ${presetShouldJoinTime[1]}`, timezone),
        undefined,
        "[]"
      )
      // also filter datetime to be during event active time
      const isBetweenActiveEvent = thisTime.isBetween(
        mainConfTimeBoundary[0],
        mainConfTimeBoundary[1],
        undefined,
        "[)"
      )

      if (isBetweenDefault && isBetweenActiveEvent) {
        accTime.push(timezoneParser(`${date} ${time}`, timezone).toISOString())
      }
    })

    return {
      date,
      time: accTime,
    }
  })

  return {
    startDate: startDate,
    endDate: endDate,
    dateRange,
    mainConfTimeBoundary,
    defaultAvailableTime,
    currentEdition,
    currentEditionName,
    // text of main conference date
    // e.g. start = "December 1, 2021", end = "December 2, 2021"
    // text is "December 1 - 2, 2021"
  }
}

export { timeOptions }
export default useEventTime
