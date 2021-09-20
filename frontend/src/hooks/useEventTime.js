import { graphql, useStaticQuery } from "gatsby"
import { timezoneParser } from "./useTimezone"

function useEventTime() {
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

  return {
    startDate: startDate,
    endDate: endDate,
    mainConfTimeBoundary,
  }
}

export default useEventTime
