import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import CommonPageStyles from '../../components/BaseComponents/CommonPageStyles';
import Layout from '../../components/layout';
// import useSiteMetadata from '../../hooks/gql/useSiteMetadata';

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

// const EmphasizedText = styled.span`
//   font-style: italic;
//   text-decoration: underline;
// `;

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

// eslint-disable-next-line arrow-body-style
export default () => {
  // const { mainConfDate, twitter } = useSiteMetadata();

  return (
    <Layout>
      <CommonPageStyles>
        <h1>
          Neuromatch Career
        </h1>
        <p>
          Our core service of neuromatch is to match people with
          similar interest together. Therefore, during and after
          the conference, we provide our platform to help match job
          posters with job seekers. We think that this will help
          foster the a field of neuroscience in the future. Please
          see
          {' '}
          <b>Jobs</b>
          {' '}
          tab on the navigation tool for more information.
        </p>
        <p>
          Here, we provide a submission portal for
          {' '}
          <b>job posters</b>
          ,
          {' '}
          <b>job seekers</b>
          {' '}
          , and a
          {' '}
          <b>job board</b>
          {' '}
          similar to what legacy conferences provide.
        </p>
        <div css="text-align: center;">
          <StyledImg
            src={require('../../../static/instructions/jobs-navigation.png')}
            alt="jobs-navigation"
          />
        </div>
        <hr />
        <h2>Job Board</h2>
        <ul>
          <li>
            We provide
            {' '}
            <Link to="/jobs/job-board">
              job board
            </Link>
            {' '}
            for everyone during and after the
            conference. If you are a job seeker, please see
            a job board to see jobs that interest you can contact
            them directly.
          </li>
          <li>
            Alternatively, you can also register via job seeker portal.
            This allows us to match and introduce you directly to
            job posters.
          </li>
        </ul>
        <hr />
        <h2>Job Posters</h2>
        <ul>
          <li>
            If you are looking for candidates for your position,
            you can use our
            {' '}
            <Link to="/jobs/job-poster">
              job poster
            </Link>
            {' '}
            page to post your job.
          </li>
          <li>
            After posting a job, it will get shown on a job
            board page. You can come back and amend an
            information later.
          </li>
          <li>
            After the conference, we will match job seekers
            and introduce them to your posted job.
          </li>
        </ul>
        <hr />
        <h2>Job Seekers</h2>
        <ul>
          <li>
            As a job seeker, you can find jobs that you are
            interested on the job board.
          </li>
          <li>
            If you submit your profile through our
            {' '}
            <Link to="/jobs/job-seeker">
              job seeker portal
            </Link>
            {' '}
            , we will algorithmically match you with job posters
            to find most suitable job for you and introduce you
            to the job posters. Job posters will get notified that
            you are matched with them.
          </li>
        </ul>
      </CommonPageStyles>
    </Layout>
  );
};
