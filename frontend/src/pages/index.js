import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import React from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import Layout from '../components/indexLayout';
import { media, Mixins } from '../utils/ui';

// -- CONSTANTS
const conferenceLogo = {
  path: '/svgs/logos/neuromatch-conference.svg',
  text: 'Neuromatch Conference',
};

const academyLogo = {
  path: '/svgs/logos/neuromatch-academy.svg',
  text: 'neuromatch academy logo',
};

// -- COMPONENTS
const DarkBackgroundStyle = createGlobalStyle`
  body {
    background-color: #222;
  }
`;

const HeaderBlock = styled.div`
  padding-bottom: 20px;
`;

const SubtitleHeading = styled.h3`
  color: #eaeaea;
  font-weight: bold;

  ${(props) => props.notBold && css`
    font-weight: normal;
  `}
`;

const TopicHeading = ({ children, hideTrailingDot }) => (
  <span
    css={`
      font-size: 1.05em;
      font-weight: bold;
      color: #eaeaea;
    `}
  >
    {children}
    {!hideTrailingDot && ' · '}
  </span>
);

TopicHeading.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  hideTrailingDot: PropTypes.bool,
};

TopicHeading.defaultProps = {
  hideTrailingDot: false,
};

const ContentText = styled.p`
  color: #e0e0e0;
`;

// const SepLine = styled.hr`
//   background-color: white;
// `;

const ProgramBlock = styled.div`
  text-align: center;

  /* grow full width */
  ${Mixins.growOverParentPadding(100)}
`;

const ProgramArray = styled.div`
  display: flex;
  justify-content: center;
`;

const Program = styled.div`
  width: 400px;

  p {
    /* remove default margin */
    margin: 0;
  }
`;

const LogoWrapper = styled(Link)`
  display: flex;
  padding: 14px 0;

  ${media.extraSmall`
    margin-left: 10px;
  `}
`;

const StyledImg = styled.img`
  margin: 15px auto 10px;
  max-height: 100px;
  max-width: 300px;
`;

// -- MAIN
export default () => (
  <Layout>
    <DarkBackgroundStyle />
    <HeaderBlock>
      <ContentText>
        Neuromatch is a 501c3 not-for-profit organization in the United
        States. We are an online community of computational neuroscientists
        whose mission is to foster inclusive global interactions for
        learning, mentorship, networking, and professional development.
      </ContentText>
      <ContentText>
        <TopicHeading>
          If you are looking to apply for the Neuromatch Academy, click on the academy link below.
          The Login button on this page is only for the conference
        </TopicHeading>
      </ContentText>
      <ProgramBlock>
        <ProgramArray>
          <Program>
            <LogoWrapper to="/conference">
              <StyledImg src={conferenceLogo.path} alt={conferenceLogo.text} />
            </LogoWrapper>
          </Program>
          <Program>
            <LogoWrapper to="https://academy.neuromatch.io">
              <StyledImg src={academyLogo.path} alt={academyLogo.text} />
            </LogoWrapper>
          </Program>
        </ProgramArray>
      </ProgramBlock>
      <SubtitleHeading>History</SubtitleHeading>
      <ContentText>
        Our first success was NMC1 held online on March 30-31st,
        2020 which brought together nearly 3,000 attendees from around the
        world as part of 120 talks given by both senior and junior scientists.
        Reflecting our core philosophy of building connections and community
        we matched over 500 participants to 6 other partners each, based on
        interests gleaned from natural language processing of submitted
        abstracts. A follow up conference, NMC2 was held May 25–27 2020 which
        attracted nearly 4,000 participants and offered new forms of
        interaction between attendees.
      </ContentText>
      <ContentText>
        In July 2020 we organized a three-week-long online summer school for
        July 13-31, 2020 in response to the current Covid-19 crisis which has
        shut down nearly every summer program in the world at which students,
        postdocs and faculty would normally gather to acquire crucial skills
        and build networks that are the lifeblood of academic science. This
        crisis left an enormous hole in the career prospects of our most
        valuable and vulnerable scientists.
      </ContentText>
      <ContentText>
        In November 2020, we held NMC3, which attracted thousands of attendees
        across all areas of neuroscience.
      </ContentText>
      <SubtitleHeading>Future Events</SubtitleHeading>
      <ContentText>
        <TopicHeading>NMAcore</TopicHeading>
        July 2021: the core 3-week NMA curriculum
        <br />
        <TopicHeading>NMAminis</TopicHeading>
        July 2021: half- or full-day workshops on targeted
        neuroscience-related topics
        <br />
        <TopicHeading>NMA deep learning (NMA-DL)</TopicHeading>
        August 2021: a deep learning curriculum for 3 weeks
      </ContentText>
    </HeaderBlock>
  </Layout>
);
