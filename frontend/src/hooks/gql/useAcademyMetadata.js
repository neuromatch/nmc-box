import { graphql, useStaticQuery } from 'gatsby';
import { useEffect, useState } from 'react';

/**
 * @typedef twitterObj
 * @property {string} hashtag
 * @property {string} url
 *
 * @typedef academyMetadataObj
 * @property {string} key
 * @property {string} url
 * @property {string} academyTitle
 * @property {string} academyDescription
 * @property {twitterObj} twitter
 * @property {string} schoolDate
 * @property {string} contactEmail
 * @property {string} taContactEmail
 * @property {string} syllabusUrl
 * @property {string} missionStatementUrl
 *
 * useAcademyMetadata - this hooks is designed to always return metadata of
 * the latest academy. It does allow changing edition after but need
 * a short wait between state update
 * @returns {academyMetadataObj}
 */
function useAcademyMetadata(displayEdition) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          currentEdition
          academy {
            key
            url
            academyTitle
            academyDescription
            twitter {
              hashtag
              url
            }
            schoolDate
            contactEmail
            taContactEmail
            syllabusUrl
            missionStatementUrl
          }
        }
      }
    }
  `);

  // get default current edition and all editions data from siteMetadata
  const { currentEdition, academy } = data.site.siteMetadata;
  // metadata to be returned if there is edition change
  const [metadata, setMetadata] = useState(undefined);

  // get latest edition data
  const defaultMetadata = academy.find((x) => x.key === currentEdition.split('-')[0]);

  useEffect(() => {
    // update metadata by watching edition from props
    const metadataOfEdition = academy.find((x) => x.key === displayEdition);

    if (metadataOfEdition) {
      setMetadata(metadataOfEdition);
    }

    // if provided edition doesn't have corresponded data
    // make it undefined
    if (metadataOfEdition === undefined) {
      setMetadata(undefined);
    }

    // console.log('in metadata side effect');
  }, [displayEdition, academy]);

  return metadata || defaultMetadata;
}

export default useAcademyMetadata;
