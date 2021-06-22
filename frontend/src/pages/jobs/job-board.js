/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Helmet } from 'react-helmet';
import 'react-medium-image-zoom/dist/styles.css';
import styled from 'styled-components';
import CommonPageStyles from '../../components/BaseComponents/CommonPageStyles';
import Layout from '../../components/layout';

const StyledIframe = styled.iframe`
  background: transparent;
  border: 1px solid #ccc;
  margin-top: 15px;
`;

export default () => (
  <Layout>
    <Helmet>
      <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js" />
    </Helmet>
    <CommonPageStyles>
      <h2>Job Board</h2>
      <p>
        Please see all the posted jobs below. You can click
        {' '}
        <b>view larger version</b>
        {' '}
        if you want to see a full job board page.
      </p>
      <StyledIframe
        className="airtable-embed"
        src="https://airtable.com/embed/shrGDYhDSwFHUEG6L?backgroundColor=grayLight&viewControls=on"
        frameBorder="0"
        onmousewheel=""
        width="99%"
        height="533"
      />
    </CommonPageStyles>
  </Layout>
);
