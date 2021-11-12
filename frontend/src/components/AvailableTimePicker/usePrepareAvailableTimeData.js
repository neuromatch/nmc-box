import { graphql, useStaticQuery } from "gatsby"
import moment from "moment"
import useTimezone from "../../hooks/useTimezone"
import { datetime } from "../../utils"

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
function usePrepareAvailableTimeData() {
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
              main_conference {
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
    // to get edition data of the current edition
    current_edition: currentEdition,
    // to set boundary based on time of the main timezone
    main_timezone: mainTimezone,
    // data of all edition
    editions,
  } = sitedata

  // get data of current edition
  // for AvailableTimePicker we need start and end dates of the main conference
  const {
    main_conference: { start: startDate, end: endDate },
  } = editions.find(x => x.edition === currentEdition)

  // boundary to select available time no matter what timezone the client is on
  // will be limited at mainTimezone 00:00 of the start date to 23:59 of the end date
  const mainTzStart = datetime.timezoneParser(
    `${startDate} 00:00`,
    mainTimezone
  )
  const mainTzEnd = datetime.timezoneParser(`${endDate} 23:59`, mainTimezone)

  const availableTimePickerBoundary = [
    mainTzStart.toISOString(),
    mainTzEnd.toISOString(),
  ]

  // startDate format MMMM DD, YYYY
  // new Date(startDate) gets the date at 00:00 local timezone
  // new Date("November 11, 2021") at Bangkok will get 2021-11-10 00:00 GMT+7
  const availableTimePickerRange = getAvailableTimePickerRange(
    new Date(startDate),
    new Date(endDate)
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
        accTime.push(
          datetime.timezoneParser(`${date} ${time}`, timezone).toISOString()
        )
      }
    })

    return {
      date,
      time: accTime,
    }
  })

  return {
    availableTimePickerRange,
    availableTimePickerBoundary,
    defaultAvailableTime,
  }
}

export { timeOptions }
export default usePrepareAvailableTimeData
