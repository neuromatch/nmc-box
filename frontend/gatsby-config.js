// eslint-disable-next-line import/no-extraneous-dependencies
require("dotenv").config({ path: "../.env" })

module.exports = {
  proxy: {
    prefix: "/api",
    url: "http://localhost:8000",
  },
  siteMetadata: {
    title: "NMC Box",
    description: "A demo website for Neuromatch Conference",
    siteUrl: "https://conference.neuromatch.io",
    image: "https://conference.neuromatch.io/neuromatch-og-img.png",
    logo: "https://conference.neuromatch.io/svgs/logos/Logo_mark_Bl.svg",
    type: "website",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-typography",
      options: {
        pathToConfigModule: "src/utils/typography",
      },
    },
    {
      resolve: "gatsby-plugin-styled-components",
      options: {
        // Add any options here
      },
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-153833046-1",
        exclude: ["/*.png", "/*.ico", "/static/**"],
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        features: {
          auth: true,
          database: true,
        },
      },
    },
    {
      resolve: "gatsby-plugin-anchor-links",
      options: {
        offset: -75,
      },
    },
    "gatsby-transformer-yaml",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `../sitedata/`,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 960,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-images-medium-zoom`,
            options: {},
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `../sitedata/markdown`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-images`,
        path: `./static/markdown-images`,
      },
    },
  ],
}
