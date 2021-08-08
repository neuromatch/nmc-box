import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import AbstractDetail from '../components/AgendaComponents/AbstractDetail';
import LoadingView from '../components/BaseComponents/LoadingView';
import Layout from '../components/layout';
import useQueryParams from '../hooks/useQueryParams';
import useTimezone from '../hooks/useTimezone';
import { basedStyles } from '../styles';

// TODO: include in abstract/
// neuromatch.io/abstract -> display abstract browser
// neuromatch.io/submission -> submission page
// neuromatch.io/abstract?abstractId -> display abstract details (the same with the popup)

// -- COMPONENTS
const GlobalStyle = createGlobalStyle`
  body {
    ${basedStyles.scrollStyle}
  }
`;

const Container = styled.div`
  margin-bottom: 2em;
`;

export default () => {
  const [submissionId] = useQueryParams('submission_id');
  const [submissionData, setSubmissionData] = useState({});
  const { timezone } = useTimezone();

  useEffect(() => {
    if (!submissionId) {
      return;
    }

    fetch(`/api/abstract/${submissionId}`)
      .then((res) => res.json())
      .then((resJson) => setSubmissionData(resJson))
      .finally(() => {});
  }, [submissionId]);

  if (
    submissionData.constructor === Object
    && Object.keys(submissionData).length === 0
  ) {
    return (
      <LoadingView
        message="Loading.."
      />
    );
  }

  return (
    <Layout>
      <GlobalStyle />
      <Container>
        <AbstractDetail
          data={submissionData}
          timezone={timezone}
          unlimitedContentHeight
        />
      </Container>
    </Layout>
  );
};
