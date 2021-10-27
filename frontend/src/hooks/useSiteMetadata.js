import { graphql, useStaticQuery } from 'gatsby';
import { useEffect, useState } from 'react';

/**
 * @typedef siteMetadataObj
 * @property {string} name
 * @property {string} title
 * @property {string} subtitle
 * @property {string} description
 * @property {string} edition
 * @property {string} editionName
 * @property {string} mainConfDateText
 * @property {string} registrationDateText
 * @property {string} submissionDateText
 * @property {string} twitterHashtag
 *
 * useSiteMetadata - this hooks is designed to always return metadata of
 * the latest edition.
 *
 * NOTE that this hook is used for landing page
 * @returns {siteMetadataObj}
 */
function useSiteMetadata() {
  const data = useStaticQuery(graphql`
    query siteMetaData {
      allSitedataYaml {
        edges {
          node {
            current_edition
            subtitle
            description
            name
            editions {
              page_title
              edition
              edition_name
              main_conference {
                text
              }
              registration_date {
                text
              }
              submission_date {
                text
              }
              twitter_hashtag
            }
          }
        }
      }
    }
  `);

  const [siteMetadata, setSiteMetadata] = useState({})

  useEffect(() => {
    const sitedata = data.allSitedataYaml.edges[0].node
    const {
      current_edition: currentEdition,
      subtitle,
      description,
      name,
      editions,
    } = sitedata
    const {
      page_title: title,
      edition,
      edition_name: editionName,
      main_conference: { text: mainConfDateText },
      registration_date: { text: registrationDateText },
      submission_date: { text: submissionDateText },
      twitter_hashtag: twitterHashtag,
    } = editions.find(x => x.edition === currentEdition)

    setSiteMetadata({
      name,
      title,
      subtitle,
      description,
      edition,
      editionName,
      mainConfDateText,
      registrationDateText,
      submissionDateText,
      twitterHashtag,
    })
  }, [data.allSitedataYaml.edges])

  return siteMetadata;
}

export default useSiteMetadata;
