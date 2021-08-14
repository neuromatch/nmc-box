import { graphql, useStaticQuery } from 'gatsby';
import { useEffect, useState } from 'react';

/**
 * @typedef twitterObj
 * @property {string} hashtag
 * @property {string} url
 *
 * @typedef siteMetadataObj
 * @property {string} title
 * @property {string} description
 * @property {string} longDescription
 * @property {string} key
 * @property {string} conferenceTitle
 * @property {string} conferenceDescription
 * @property {string} crowdcast
 * @property {string} registrationDate
 * @property {string} submissionDate
 * @property {string} mainConfDate
 * @property {string} feedbackDate - abstract feedback by registrants
 * @property {string} unconferenceDate
 * @property {string} archiveCrowdcast
 * @property {string} jobBoardUrl
 * @property {string} jobSeekerUrl
 * @property {string} jobPosterUrl
 * @property {string} gdocsDiscussUrl
 * @property {twitterObj} twitter
 *
 * useSiteMetadata - this hooks is designed to always return metadata of
 * the latest edition. It does allow changing edition after but need
 * a short wait between state update
 *
 * NOTE that this hooks is used for landing page, it also includes
 * conference data
 * @returns {siteMetadataObj}
 */
function useSiteMetadata(displayEdition) {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          longDescription
          currentEdition
          editions {
            key
            conferenceTitle
            conferenceDescription
            crowdcast
            registrationDate
            submissionDate
            mainConfDate
            feedbackDate
            unconferenceDate
            archiveCrowdcast
            jobBoardUrl
            jobSeekerUrl
            jobPosterUrl
            gdocsDiscussUrl
            twitter {
              hashtag
              url
            }
          }
        }
      }
    }
  `);

  // get default current edition and all editions data from siteMetadata
  const {
    title,
    description,
    longDescription,
    currentEdition,
    editions,
  } = data.site.siteMetadata;

  // console.log('data', data);

  // metadata to be returned if there is edition change
  const [metadata, setMetadata] = useState(undefined);

  // get latest edition data
  const defaultMetadata = editions.find((x) => x.key === currentEdition);

  useEffect(() => {
    // update metadata by watching edition from props
    const metadataOfEdition = editions.find((x) => x.key === displayEdition);

    if (metadataOfEdition) {
      setMetadata(metadataOfEdition);
    }

    // if provided edition doesn't have corresponded data
    // make it undefined
    if (metadataOfEdition === undefined) {
      setMetadata(undefined);
    }

    // console.log('in metadata side effect');
  }, [displayEdition, editions]);

  return {
    title,
    description,
    longDescription,
    ...(metadata || defaultMetadata),
  };
}

export default useSiteMetadata;
