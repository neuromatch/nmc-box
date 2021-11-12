import { graphql, useStaticQuery } from "gatsby"
import { useEffect, useState } from "react"
import useAPI from "./useAPI"

// -- CONSTANTS
// move all the colors of theme and stuffs here?
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

  const { getStartEndOfAbstracts } = useAPI()
  const [startEndTime, setStartEnd] = useState({})
  const [mainConfMetadata, setMainConferenceMetadata] = useState({})

  useEffect(() => {
    const getTimePromise = getStartEndOfAbstracts({ edition })

    if (!getTimePromise) {
      return
    }

    getTimePromise
    .then(res => res.json())
    .then(resJson => {
      setStartEnd(resJson)
    })
  }, [edition, getStartEndOfAbstracts])

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

    const { starttime, endtime } = startEndTime

    if (!starttime || !endtime) {
      return;
    }

    const eventTimeBoundary = [
      new Date(starttime).toISOString(),
      new Date(endtime).toISOString(),
    ]

    const resourceMap = tracks.map(track => ({
      track,
      resourceTitle: `${track.charAt(0).toUpperCase()}${track.slice(1)}`,
    }))

    // TODO: refactor return object structure
    // probably split eventTimeBoundary out of this side effect too
    setMainConferenceMetadata({
      edition: edition || currentEdition,
      mainTimezone,
      ...mainConference,
      eventTimeBoundary,
      resourceMap,
    })
  }, [data.allSitedataYaml.edges, edition, startEndTime])

  return { mainConfMetadata }
}

export { talkFormatLabelColors }
export default useDisplayEdition
