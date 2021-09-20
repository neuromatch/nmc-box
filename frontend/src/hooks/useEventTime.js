import { graphql, useStaticQuery } from "gatsby"
import moment from "moment"
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
function useEventTime() {
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
    main_conference: { start: startDate, end: endDate },
    event_time: { start: startTime, end: endTime },
  } = editions.find(x => x.edition === currentEdition)

  // time boundary of the main conference
  const mainConfTimeBoundary = [
    timezoneParser(`${startDate} ${startTime}`, mainTimezone).toISOString(),
    timezoneParser(`${endDate} ${endTime}`, mainTimezone).toISOString(),
  ]

  // dateRange is used in AvailableTimePicker to generate picker in the range of an event
  const beforeStartDate = moment(startDate)
    .subtract(1, "d")
    .format("MMMM DD, YYYY")
  const afterEndDate = moment(endDate)
    .add(1, "d")
    .format("MMMM DD, YYYY")
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
  }
}

export { timeOptions }
export default useEventTime
