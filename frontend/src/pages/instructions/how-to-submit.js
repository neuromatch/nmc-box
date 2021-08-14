import PropTypes from 'prop-types';
// import { Link } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import CommonPageStyles from '../../components/BaseComponents/CommonPageStyles';
import Layout from '../../components/layout';
import useSiteMetadata from '../../hooks/gql/useSiteMetadata';

const StyledImg = styled.img`
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 3px;
  margin-top: 10px;
  width: 85%;
`;

// const BrandFont = styled.span`
//   font-weight: bold;
//   font-size: 1.1em;
//   color: #000;
//   font-family: "Nunito";

//   /* add space without having to &nbsp; */
//   ${(p) => !p.noBeforeSpace
//     && css`
//       &::before {
//         content: " ";
//       }
//     `}

//   ${(p) => !p.noAfterSpace
//     && css`
//       &::after {
//         content: " ";
//       }
//     `}
// `;

const EmphasizedText = styled.span`
  font-style: italic;
  text-decoration: underline;
`;

const TopicHeading = ({ children }) => (
  <span
    css={`
      font-size: 1.05em;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.8);
    `}
  >
    {children}
    {' '}
  </span>
);

TopicHeading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

export default () => {
  const { submissionDate } = useSiteMetadata();

  return (
    <Layout>
      <CommonPageStyles>
        <h2>Submission instructions</h2>
        <p>
          Neuromatch 3.0 welcomes all abstracts in any topic area within
          neuroscience! Please register and submit your abstract under
          your profile (
          {' '}
          <a href="/abstract-submission" target="_blank" rel="noopener noreferrer">
            submission button
          </a>
          {' '}
          is located on the top-right of the page).
        </p>
        <p>
          Abstracts will be screened only for obvious topical irrelevance to the
          neuroscience community. For each title and abstract submitted, the
          submitter will select the presentation format
          {' '}
          <EmphasizedText>traditional talk presentation</EmphasizedText>
          {' '}
          or
          {' '}
          <EmphasizedText>interactive talk presentation</EmphasizedText>
          .
        </p>
        <StyledImg
          src={require('../../../static/instructions/submission.png')}
          alt="profile"
        />
        <p>
          <TopicHeading>Traditional Talks</TopicHeading>
          will be scheduled for a single
          {' '}
          <EmphasizedText>15 minutes time slot</EmphasizedText>
          {' '}
          , consisting of a
          {' '}
          <EmphasizedText>12 minutes presentation</EmphasizedText>
          {' '}
          and
          {' '}
          <EmphasizedText>3 minutes of Q&amp;A</EmphasizedText>
          .
          Speakers are expected to show up 5 minutes before their session starts
          and attend the full session to allow for great discussions.
          <br />
          <TopicHeading>Interactive talks</TopicHeading>
          will be a single
          {' '}
          <EmphasizedText>roughly 5 minute introduction to the research</EmphasizedText>
          {' '}
          followed by a
          {' '}
          <EmphasizedText>10 minute discussion</EmphasizedText>
          . This format is meant to allow more intensive discussions and feel similar
          to poster presentations in traditional conferences. There will be 5-7 such
          presentations in a 2-hours block. Every presenter is expected to attend
          the whole 2 hours and participate in the discussions.
        </p>
        <p>
          All abstracts are limited to
          {' '}
          <EmphasizedText>300 words</EmphasizedText>
          {' '}
          and topical keywords will be chosen upon submission. Each submission
          will be accompanied by indicating the time slots where one is available
          to attend the conference (for presentation or viewing). Each abstract
          submitter must also participate in the abstract feedback process after
          the submission window where one indicates which abstracts one is are
          most interested in attending (aided by our matching algorithms).
          Abstracts will be viewed without author names or institutions to
          increase fairness and reduce prestige bias. This information will be
          used to aid in determining the conference schedule.
          {' '}
          <EmphasizedText>
            Abstracts will be withdrawn and not presented if the submitter does
            not participate in the feedback period.
          </EmphasizedText>
        </p>
        <hr />
        <p>
          <TopicHeading>Submission date</TopicHeading>
          {` · ${submissionDate}`}
          <br />
          <TopicHeading>Note</TopicHeading>
          {' · '}
          We only allow one submission per attendee. An additional submission
          will replace the former one.
        </p>
      </CommonPageStyles>
    </Layout>
  );
};
