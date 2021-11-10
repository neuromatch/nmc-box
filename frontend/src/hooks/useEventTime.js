import { graphql, useStaticQuery } from "gatsby"
import moment from "moment"
import { useEffect, useState } from "react"
import { datetime } from "../utils"
import useAPI from "./useAPI"
import useSiteMetadata from "./useSiteMetadata"
import useTimezone from "./useTimezone"

// -- CONSTANTS
// this will generate ["00:00", "01:00", ..., "23.00"]
const timeOptions = Array.from({ length: 24 }).map((_, ind) =>
  ind < 10 ? `0${ind}:00` : `${ind}:00`
)

// -- FUNCTIONS
/**
 * getAvailableTimePickerRange - this function receives start and end as Date object.
 * @param {Date} start
 * @param {Date} end
 * @returns {String[]}
 * @description
 * The conversion is as follows:
 * - date from config.yml
 *   -> November 10, 2021
 * - parse using Date so it becomes 00:00 of local timezone
 *   -> new Date('November 10, 2021') -> November 10, 2021 00:00 GMT+7 (Bangkok)
 * - we only care about date (November 10, 2021) for AvailableTimePicker
 *
 * The result range will be [start-1, end+1], for example start date is
 * November 10, 2021 and end date is November 12, 2021 the list will be
 * ["November 9, 2021", "November 10, 2021" ..., "November 13, 2021"]
 */
const getAvailableTimePickerRange = (start, end) => {
  const momentStart = moment(start).subtract(1, "day")
  const diff = moment(end).diff(momentStart, "d")
  const range = []
  // first date
  range.push(momentStart.format("MMMM DD, YYYY"))

  for (let i = 0; i <= diff; i++) {
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
  } = editions.find(x => x.edition === currentEdition)

  // ---- FOR AvailableTimePicker
  const mainTzStartISO = datetime.timezoneParser(`${startDate} 00:00`, mainTimezone)
  const mainTzEndISO = datetime.timezoneParser(`${endDate} 23:59`, mainTimezone)

  const availableTimePickerBoundary = [
    mainTzStartISO.toISOString(),
    mainTzEndISO.toISOString(),
  ]

  // startDate format MMMM DD, YYYY
  // new Date(startDate) gets the date at 00:00 local timezone
  // new Date("November 11, 2021") at Bangkok will get 2021-11-10 00:00 GMT+7
  const availableTimePickerRange = getAvailableTimePickerRange(
    new Date(startDate),
    new Date(endDate),
  )

  // the first time user is about to register, we will pre-select
  // time slots in this period of their timezone in the AvailableTimePicker.
  const presetShouldJoinTime = ["9:00", "18:00"]
  const defaultAvailableTime = availableTimePickerRange.map(date => {
    const accTime = []

    timeOptions.forEach(time => {
      const thisTime = datetime.timezoneParser(`${date} ${time}`, timezone)
      const isBetweenDefault = thisTime.isBetween(
        datetime.timezoneParser(`${date} ${presetShouldJoinTime[0]}`, timezone),
        datetime.timezoneParser(`${date} ${presetShouldJoinTime[1]}`, timezone),
        undefined,
        "[]"
      )
      // also filter datetime to be during event active time
      const isBetweenEvent = thisTime.isBetween(
        availableTimePickerBoundary[0],
        availableTimePickerBoundary[1],
        undefined,
        "[)"
      )

      if (isBetweenDefault && isBetweenEvent) {
        accTime.push(datetime.timezoneParser(`${date} ${time}`, timezone).toISOString())
      }
    })

    return {
      date,
      time: accTime,
    }
  })
  // ---- ENDFOR AvailableTimePicker

  /**
   * TODO: TO BE REMOVED
   * @description this is always ISO strings. It is used to tell start and end time
   * of the latest conference.
   */
   const mainConfTimeBoundary = [
    datetime.timezoneParser(`${startDate} 07:00`, mainTimezone).toISOString(),
    datetime.timezoneParser(`${endDate} 21:00`, mainTimezone).toISOString(),
  ]

  return {
    startDate: startDate,
    endDate: endDate,
    mainConfTimeBoundary,
    currentEdition,
    currentEditionName,
    availableTimePickerRange,
    availableTimePickerBoundary,
    defaultAvailableTime,
  }
}

export { timeOptions }
export default useEventTime
