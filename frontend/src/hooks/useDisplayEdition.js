import { graphql, useStaticQuery } from "gatsby"
import { useEffect, useState } from "react"
import { datetime } from "../utils"

// -- CONSTANTS
const talkFormatLabelColors = {
  'Contributed talks': '#d0f0fd',
  'Interactive talk': '#d0f0fd',
  'Short talk': '#d1f7c4',
  'Traditional talk': '#d1f7c4',
  'Keynote': '#fcb301',
  'Keynote Event': '#fcb301',
  'Special Event': '#f82a60',
};

/**
 * @typedef {Object} MainConfMetadata
 * @property {String} edition - the edition of current data
 * @property {String} start - end date for main conference
 * @property {String} end - end date for main conference
 * @property {String} text - text of organized date for main conference
 * @property {String[]} eventTimeBoundary - lower and upper boundary of main conference event time based on timezone
 * @property {Object[]} resourceMap - resources mapping for each edition
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
              tracks
            }
          }
        }
      }
    }
  `)

  const [mainConfMetadata, setMainConferenceMetadata] = useState({})

  useEffect(() => {
    const sitedata = data.allSitedataYaml.edges[0].node
    const {
      current_edition: currentEdition,
      editions,
      main_timezone: mainTimezone,
    } = sitedata
    const {
      main_conference: mainConference,
      tracks,
    } = editions.find(x => x.edition === (edition || currentEdition))

    /**
     * TODO: TO BE REMOVED
     * @description this one is almost identical with mainConfTimeBoundary in useEventTime. There are 2 main differences:
     * 1) the time to be parsed here is dynamic based on selected edition
     * 2) this is an instance of Date() because it is only used in agenda (for big calendar component)
     */
    const eventTimeBoundary = [
      new Date(
        datetime.timezoneParser(
          `${mainConference.start} 07:00`,
          mainTimezone
        ).toISOString()
      ),
      new Date(
        datetime.timezoneParser(
          `${mainConference.end} 21:00`,
          mainTimezone
        ).toISOString()
      ),
    ]

    const resourceMap = tracks.map(x => ({
      track: x,
      resourceTitle: `${x.charAt(0).toUpperCase()}${x.slice(1)}`,
    }))

    setMainConferenceMetadata({
      edition: edition || currentEdition,
      ...mainConference,
      eventTimeBoundary,
      resourceMap,
    })
  }, [data.allSitedataYaml.edges, edition])

  return { mainConfMetadata }
}

export { talkFormatLabelColors }
export default useDisplayEdition
