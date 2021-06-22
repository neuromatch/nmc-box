import { useStaticQuery, graphql } from 'gatsby';
import { useState, useEffect } from 'react';

/**
 * @typedef statObj
 * @property {string} location
 * @property {number} n_users
 * @property {number[]} position
 *
 * useStatsData - this hooks is designed to always return stats data
 * of the latest edition. It does allow changing edition after but need
 * a short wait between state update
 * @param {string} displayEdition
 * @returns {statObj[]}
 */
function useStatsData(displayEdition) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          prevEdition
        }
      }
      allStatsJson {
        edges {
          node {
            edition
            data {
              location
              n_users
              position
            }
          }
        }
      }
    }
  `);

  // get default edition from siteMetadata, for stats we use prevEdition
  const { prevEdition } = data.site.siteMetadata;
  // statsData to be returned if there is edition change
  const [statsData, setStatsData] = useState(undefined);

  // get data of the edition to be plotted
  const { node: { data: defaultStats } } = data.allStatsJson.edges
    .find(({ node }) => node.edition === prevEdition);

  useEffect(() => {
    // update metadata by watching edition from props
    const statsOfEdition = data.allStatsJson.edges
      .find(({ node }) => node.edition === displayEdition);

    if (statsOfEdition) {
      setStatsData(statsOfEdition.node.data);
    }

    // for too new version that doesn't have data in the file yet
    if (statsOfEdition === undefined) {
      setStatsData(undefined);
    }
  }, [data.allStatsJson.edges, displayEdition]);

  return statsData || defaultStats;
}

export default useStatsData;
