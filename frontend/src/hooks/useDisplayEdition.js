import { graphql, useStaticQuery } from "gatsby"
import { useEffect, useState } from "react"
import { timezoneParser } from "./useTimezone"

/**
 * @typedef {Object} MainConfMetadata
 * @property {String} edition - the edition of current data
 * @property {String} start - end date for main conference
 * @property {String} end - end date for main conference
 * @property {String} text - text of organized date for main conference
 * @property {String[]} eventTimeBoundary - lower and upper boundary of main conference event time based on timezone
 *
 * useDisplayEdition - a function to get data depended on display edition
 * @param {String} edition
 * @returns {{ mainConfMetadata: MainConfMetadata }}
 */
function useDisplayEdition(edition) {
  const data = useStaticQuery(graphql`
    query displayEdition {
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

  const [mainConfMetadata, setMainConferenceMetadata] = useState({})

  useEffect(() => {
    console.log("edition", edition)

    const sitedata = data.allSitedataYaml.edges[0].node
    const {
      current_edition: currentEdition,
      editions,
      main_timezone: mainTimezone,
    } = sitedata
    const {
      main_conference: mainConference,
      event_time: eventTime,
    } = editions.find(x => x.edition === (edition || currentEdition))

    /**
     * @description this one is almost identical with mainConfTimeBoundary in useEventTime. There are 2 main differences:
     * 1) the time to be parsed here is dynamic based on selected edition
     * 2) this is an instance of Date() because it is only used in agenda (for big calendar component)
     */
    const eventTimeBoundary = [
      new Date(
        timezoneParser(
          `${mainConference.start} ${eventTime.start}`,
          mainTimezone
        ).toISOString()
      ),
      new Date(
        timezoneParser(
          `${mainConference.end} ${eventTime.end}`,
          mainTimezone
        ).toISOString()
      ),
    ]

    setMainConferenceMetadata({
      edition: edition || currentEdition,
      ...mainConference,
      eventTimeBoundary,
    })
  }, [data.allSitedataYaml.edges, edition])

  return { mainConfMetadata }
}

export default useDisplayEdition
