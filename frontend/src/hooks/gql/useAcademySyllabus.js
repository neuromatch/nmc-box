import { useStaticQuery, graphql } from 'gatsby';
import { useState, useEffect } from 'react';

// TODO: Revise JS docstring for academy syllabus @bluenex

/**
 * @typedef selectObj
 * @property {string} label
 * @property {string} value
 *
 * @typedef talkFormatObj
 * @property {string} name
 * @property {string} url
 *
 * @typedef scheduleObj
 * @property {string} title
 * @property {string} speaker
 *
 * @typedef agendaObj
 * @property {string} time_edt
 * @property {string} time_gmt
 * @property {string} speaker
 * @property {string} title
 * @property {string} abstract
 * @property {talkFormatObj[]} talk_format
 * @property {scheduleObj[][]} schedule
 *
 * @typedef eachDateObj
 * @property {string} date
 * @property {agendaObj[]} data
 *
 * useAcademySyllabus - this hooks is designed to always return agenda data
 * of the latest edition. It does allow changing edition after but need
 * a short wait between state update
 * @param {string} displayEdition
 * @returns {eachDateObj[]}
 */
function useAcademySyllabus(displayEdition) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          currentEdition
        }
      }
      allAcademyJson {
        edges {
          node {
            edition
            data {
              week
              data {
                datetime_utc
                description
                title
                schedule {
                  details
                  endtime
                  lecture
                  starttime
                }
              }
            }
          }
        }
      }
    }
  `);

  // get default current edition and all editions data from siteMetadata
  const { currentEdition } = data.site.siteMetadata;
  // syllabusData to be returned if there is edition change
  const [syllabusData, setSyllabusData] = useState(undefined);

  // get latest edition data
  const {
    node: {
      data: defaultSyllabusData,
    },
  } = data.allAcademyJson.edges
    .find(({ node }) => currentEdition.includes(node.edition));

  useEffect(() => {
    // update metadata by watching edition from props
    const syllabusOfEdition = data.allAcademyJson.edges
      .find(({ node }) => displayEdition && displayEdition.includes(node.edition));

    if (syllabusOfEdition) {
      setSyllabusData(syllabusOfEdition.node.data);
    }

    // for too new version that doesn't have data in the file yet
    if (syllabusOfEdition === undefined) {
      setSyllabusData(undefined);
    }
  }, [data.allAcademyJson.edges, displayEdition]);

  return syllabusData || defaultSyllabusData;
}

export default useAcademySyllabus;
