/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Helmet } from 'react-helmet';
import 'react-medium-image-zoom/dist/styles.css';
import styled from 'styled-components';
import Layout from '../components/layout';

const StyledIframe = styled.iframe`
  background: transparent;
  margin-top: 15px;
`;

// change to yaml

export default () => (
  <Layout noPadding>
    <Helmet>
      <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js" />
    </Helmet>
    <StyledIframe
      title="job-seeker-form"
      className="airtable-embed airtable-dynamic-height"
      src="https://airtable.com/embed/shrGQDIbXgZB6wiig?viewControls=on"
      frameBorder="0"
      onmousewheel=""
      width="100%"
      height="750"
    />
  </Layout>
);
