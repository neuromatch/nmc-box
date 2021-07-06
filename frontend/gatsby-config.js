// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config({ path: '.frontend.env' });

module.exports = {
  proxy: {
    prefix: '/api',
    url: 'http://localhost:8888',
  },
  siteMetadata: {
    prevEdition: '2020-2',
    currentEdition: '2020-3',
    title: 'neuromatch 3.0',
    description: 'A conference made for the whole neuroscience community',
    longDescription: 'Based on the successful mind-matching session at the Cognitive Computational Neuroscience (CCN) conference and previous Neuromatch conference with more than 6k attendees, we decided to create an online unconference for all neuroscientists. We are building a better online experience for neuroscience conferences by making them more open, inclusive, and democratic.',
    siteUrl: 'https://neuromatch.io',
    image: 'https://neuromatch.io/neuromatch-og-img.png',
    logo: 'https://neuromatch.io/svgs/logos/Logo_mark_Bl.svg',
    type: 'website',
    editions: [
      {
        key: '2020-1',
        conferenceTitle: 'Neuromatch 1.0',
        conferenceDescription: 'An unconference in Computational Neuroscience',
        registrationDate: 'March 16 - 25, 2020',
        submissionDate: 'March 16 - 25, 2020',
        mainConfDate: 'March 30 - 31, 2020',
        unconferenceDate: 'March 29 to April 10, 2020',
        twitter: {
          hashtag: '#neuromatch2020',
          url: 'https://twitter.com/hashtag/neuromatch2020',
        },
        crowdcast: 'https://www.crowdcast.io/e/neuromatch',
        archiveCrowdcast: 'https://www.crowdcast.io/e/neuromatch',
        jobBoardUrl:
          'https://docs.google.com/document/d/18uf732h-1XrwN9oaOZFJhHYRPOeiZrOki0Hn6Tr9cFg/edit',
        jobSeekerUrl:
          'https://docs.google.com/forms/d/e/1FAIpQLSdaTPpim1JClJgUhDulb3n4WetCsN1VU4aq4FdT0KvNvVc4NA/viewform',
        jobPosterUrl:
          'https://docs.google.com/forms/d/e/1FAIpQLSfrrwiXYaCsIZOkm1iDVcl8givFGjlZqaAT2zSg6YLNsIakCg/viewform?vc=0&c=0&w=1',
        gdocsDiscussUrl:
          'https://docs.google.com/document/d/1NC51qaPcrinlqQEtgmJkXDs13NlW_D3vWC1iKa5xDDI/edit?usp=sharing',
      },
      {
        key: '2020-2',
        conferenceTitle: 'Neuromatch 2.0',
        conferenceDescription: 'An unconference in Computational Neuroscience',
        registrationDate: 'April 20 to May 20, 2020',
        submissionDate: 'April 20 to May 20, 2020',
        mainConfDate: 'May 25 - 27, 2020',
        unconferenceDate: 'May 23 to June 3, 2020',
        twitter: {
          hashtag: '#neuromatch2020',
          url: 'https://twitter.com/hashtag/neuromatch2020',
        },
        crowdcast: 'https://www.crowdcast.io/e/neuromatch2',
        archiveCrowdcast: 'https://www.crowdcast.io/e/neuromatch',
        jobBoardUrl:
          'https://docs.google.com/document/d/18uf732h-1XrwN9oaOZFJhHYRPOeiZrOki0Hn6Tr9cFg/edit',
        jobSeekerUrl:
          'https://docs.google.com/forms/d/e/1FAIpQLSdaTPpim1JClJgUhDulb3n4WetCsN1VU4aq4FdT0KvNvVc4NA/viewform',
        jobPosterUrl:
          'https://docs.google.com/forms/d/e/1FAIpQLSfrrwiXYaCsIZOkm1iDVcl8givFGjlZqaAT2zSg6YLNsIakCg/viewform?vc=0&c=0&w=1',
        gdocsDiscussUrl:
          'https://docs.google.com/document/d/1faMRz-hQeP1aQnRvRhM9SDy_XAtMaEd_s5aAHPOyMY0/edit',
      },
      {
        key: '2020-3',
        conferenceTitle: 'Neuromatch 3.0',
        conferenceDescription: 'An unconference in Neuroscience',
        registrationDate: 'Anytime before October 30',
        submissionDate: 'October 7, 2020',
        mainConfDate: 'October 26 - 30, 2020',
        feedbackDate: 'October 2 - 9, 2020',
        unconferenceDate: '',
        twitter: {
          hashtag: '#nmc3',
          url: 'https://twitter.com/hashtag/nmc3',
        },
        crowdcast: '',
        archiveCrowdcast: '',
        jobBoardUrl: 'https://neuromatch.io/jobboard',
        jobSeekerUrl: 'https://neuromatch.io/jobseeker',
        jobPosterUrl: 'https://neuromatch.io/jobposter',
        gdocsDiscussUrl: '',
      },
    ],
    academy: [
      {
        key: '2020',
        url: 'https://academy.neuromatch.io',
        academyTitle: 'Neuromatch Academy',
        academyDescription: 'An online school for Computational Neuroscience',
        twitter: {
          hashtag: '#NeuromatchAcademy',
          url: 'https://twitter.com/hashtag/NeuromatchAcademy',
        },
        missionStatementUrl: 'https://docs.google.com/document/d/1ta2XVAe24v43Lvvsdev71JCh8lGuzZIrBh4wzmi2KVo/edit',
        schoolDate: 'July 13 - 31, 2020, across multiple timezones, available worldwide',
        contactEmail: 'neuromatchacademy@neuromatch.io',
        taContactEmail: 'peters.megan@gmail.com',
        syllabusUrl: 'https://github.com/NeuromatchAcademy/course-content',
      },
    ],
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: 'gatsby-plugin-styled-components',
      options: {
        // Add any options here
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-eslint',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: './src/data/',
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-153833046-1',
        exclude: ['/*.png', '/*.ico', '/static/**'],
      },
    },
    {
      resolve: 'gatsby-plugin-firebase',
      options: {
        features: {
          auth: true,
          database: true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-anchor-links',
      options: {
        offset: -75,
      },
    },
    {
      resolve: 'gatsby-plugin-react-leaflet',
      options: {
        linkStyles: true,
      },
    },
  ],
};
