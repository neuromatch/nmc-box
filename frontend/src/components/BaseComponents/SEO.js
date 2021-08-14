import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

const SEO = () => (
  <StaticQuery
    query={graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            image
            type
          }
        }
      }
    `}
    render={({ site: { siteMetadata } }) => {
      const {
        title,
        description,
        siteUrl,
        image,
        type,
      } = siteMetadata;

      return (
        <>
          <Helmet>
            {/* General tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="image" content={image} />
            <link rel="canonical" href={siteUrl} />

            {/* OpenGraph tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:type" content={type} />

            {/* Twitter Card tags */}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:card" content="summary_large_image" />
          </Helmet>
        </>
      );
    }}
  />
);

export default SEO;
