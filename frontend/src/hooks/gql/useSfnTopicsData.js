import { useStaticQuery, graphql } from 'gatsby';
import { useState, useEffect } from 'react';

/**
 * @typedef sfnDataObj
 * @property {string[]} sfnThemes
 * @property {string[]} sfnTopics
 * @property {string[]} sfnSubTopics
 *
 * useSfnTopicsData - this hook returns data of themes, topics and subtopics
 * of the SFN conference. These data are used in reviewer register and submission processes
 * @returns {sfnDataObj}
 */
function useSfnTopicsData() {
  const data = useStaticQuery(graphql`
    query {
      allSfnJson {
        edges {
          node {
            themes
            topics
            subtopics
          }
        }
      }
    }
  `);

  const [sfnThemes, setSfnThemes] = useState([]);
  const [sfnTopics, setSfnTopics] = useState([]);
  const [sfnSubTopics, setSfnSubTopics] = useState([]);

  // get data of sfn themes/topics/subtopics
  const { node: { themes, topics, subtopics } } = data.allSfnJson.edges?.[0];

  useEffect(() => {
    setSfnThemes(themes);
    setSfnTopics(topics);
    setSfnSubTopics(subtopics);
  }, [subtopics, themes, topics]);

  return { sfnThemes, sfnTopics, sfnSubTopics };
}

export default useSfnTopicsData;
