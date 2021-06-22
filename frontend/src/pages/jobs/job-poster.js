/* eslint-disable jsx-a11y/accessible-emoji */
import { navigate } from 'gatsby';
import React from 'react';
import { Helmet } from 'react-helmet';
import 'react-medium-image-zoom/dist/styles.css';
import styled from 'styled-components';
import LoadingView from '../../components/BaseComponents/LoadingView';
import Layout from '../../components/layout';
import useFirebaseWrapper from '../../hooks/useFirebaseWrapper';
import useValidateRegistration from '../../hooks/useValidateRegistration';

const StyledIframe = styled.iframe`
  background: transparent;
  border: 1px solid #ccc;
  margin-top: 15px;
`;

export default () => {
  const { isLoggedIn } = useValidateRegistration();
  const { currentUserInfo } = useFirebaseWrapper();

  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate('/');
    }, 2500);

    return (
      <LoadingView message="You are not logged in, redirecting to homepage.." />
    );
  }

  if (!currentUserInfo?.uid) {
    return <LoadingView />;
  }

  return (
    <Layout noPadding>
      <Helmet>
        <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js" />
      </Helmet>
      <StyledIframe
        title="job-poster-form"
        className="airtable-embed airtable-dynamic-height"
        src={`https://airtable.com/embed/shreB34rUWOKfDjzC?backgroundColor=grayLight&prefill_Record+ID=${currentUserInfo.uid}`}
        frameBorder="0"
        onmousewheel=""
        width="100%"
        height="3241.005682"
      />
    </Layout>
  );
};
