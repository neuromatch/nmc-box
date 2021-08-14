import { useStaticQuery, graphql } from 'gatsby';
import { useState, useEffect } from 'react';

/**
 * @typedef Person
 * @property {string} fullname
 * @property {string} institution
 *
 * @typedef EachTheme
 * @property {string} theme
 * @property {Person[]} committees
 *
 * useProgramCommitteesData - this hooks is designed to always return committees data
 * of the latest edition. It does allow changing edition after but need
 * a short wait between state update
 * @param {string} displayEdition
 * @returns {EachTheme[]}
 */
function useProgramCommitteesData(displayEdition) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          currentEdition
        }
      }
      allProgramCommitteesJson {
        edges {
          node {
            edition
            data {
              theme
              committees {
                fullname
                institution
              }
            }
          }
        }
      }
    }
  `);

  // get default current edition and all editions data from siteMetadata
  const { currentEdition } = data.site.siteMetadata;
  const [committeesData, setCommitteesData] = useState(undefined);

  // get data of the latest edition
  const {
    node: {
      data: defaultCommitteesData,
    },
  } = data.allProgramCommitteesJson.edges
    .find(({ node }) => currentEdition.includes(node.edition));

  useEffect(() => {
    // update metadata by watching edition from props
    const committeesOfEdition = data.allProgramCommitteesJson.edges
      .find(({ node }) => displayEdition?.includes(node.edition));

    if (committeesOfEdition) {
      setCommitteesData(committeesOfEdition.node.data);
    }

    // for too new version that doesn't have data in the file yet
    if (committeesOfEdition === undefined) {
      setCommitteesData(undefined);
    }
  }, [data.allProgramCommitteesJson.edges, displayEdition]);

  return committeesData || defaultCommitteesData;
}

export default useProgramCommitteesData;
