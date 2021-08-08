// import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import React from 'react';
import { ReactSVG } from 'react-svg';
import styled, { createGlobalStyle, css } from 'styled-components';
// import { LineButton } from '../components/BaseComponents/Buttons';
import { Container } from '../components/BaseComponents/container';
import Layout from '../components/layout';
// import useAcademyMetadata from '../hooks/gql/useAcademyMetadata';
import useSiteMetadata from '../hooks/gql/useSiteMetadata';
import useProgramCommitteesData from '../hooks/gql/useProgramCommitteesData';
import Fa from '../utils/fontawesome';
import { media, growOverParentPadding } from '../styles';

// -- CONSTANTS
const goals = [
  {
    svg: 'svgs/icons/neuromatch_icon_AIMatching.svg',
    text: 'Simplify conferences, reduce meeting and travel costs',
  },
  {
    svg: 'svgs/icons/neuromatch_icon_CarbonFootprint.svg',
    text: 'Reduce carbon emissions',
  },
  {
    svg: 'svgs/icons/neuromatch_icon_conference.svg',
    text: 'Find new ideas or collaborators',
  },
];

const sponsors = [
  {
    require: require('../../static/upenn-official-logo-for-dark.png'),
    text: 'University of Pennsylvania',
  },
  {
    require: require('../../static/imperial-official-logo-for-dark.png'),
    text: 'Imperial College London',
  },
  {
    require: require('../../static/penn-state-logo.png'),
    text: 'Penn State University',
  },
  {
    require: require('../../static/georgia-tech-logo.png'),
    text: 'Georgia Tech Institute of Technology',
  },
  {
    require: require('../../static/ist-austria-logo.png'),
    text: 'IST Austria',
  },
  {
    require: require('../../static/imbb-forth-logo.jpg'),
    text: 'IMBB Forth',
  },
  {
    require: require('../../static/uc-irvine-logo.png'),
    text: 'UC Irvine',
  },
];

// -- COMPONENTS
const DarkBackgroundStyle = createGlobalStyle`
  body {
    background-color: #222;
  }
`;

const HeaderBlock = styled.div`
  padding-bottom: 20px;
`;

const TitleHeading = styled.h1`
  color: #eee;
  font-size: 72px;

  /* scale according to screen width */
  ${media.extraSmall`
    font-size: 16vw;
  `}
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

const EmphasizedText = styled.span`
  font-style: italic;
`;

const SepLine = styled.hr`
  background-color: white;
`;

const GoalBlock = styled.div`
  text-align: center;
  background-color: #333;

  /* grow full width */
  ${growOverParentPadding(100)}
`;

const GoalsArray = styled.div`
  display: flex;
  justify-content: space-between;

  /* show goals vertically in smaller screen */
  ${media.small`
    justify-content: center;
    flex-wrap: wrap;
  `}
`;

const EachGoal = styled.div`
  width: 250px;

  p {
    /* remove default margin */
    margin: 0;
  }
`;

const StyledSVG = styled(ReactSVG)`
  margin: 0 auto 10px;
  height: 200px;
  width: 200px;
  fill: #eee;
`;

const renderGoal = ({ svg, text }) => (
  <EachGoal key={svg}>
    <StyledSVG src={svg} />
    <ContentText>{text}</ContentText>
  </EachGoal>
);

renderGoal.propTypes = {
  svg: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

const SponsorBlock = styled(GoalBlock)`
  background-color: #333;
`;

const SponsorsArray = styled(GoalsArray)`
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const EachSponsor = styled.div`
  ${media.extraLarge`
    width: ${1140 / 5}px;
  `}
  ${media.large`
    width: ${960 / 6}px;
  `}
  ${media.small`
    width: ${720 / 6}px;
  `}

  display: flex;
  align-items: center;
  margin: 0 20px;
`;

const StyledImg = styled.img`
  margin: 15px auto 10px;
  max-height: 100px;
`;

// eslint-disable-next-line react/prop-types
const renderSponsor = ({ require, text }) => (
  <EachSponsor key={text}>
    <StyledImg src={require} />
  </EachSponsor>
);

renderSponsor.propTypes = {
  text: PropTypes.string.isRequired,
};

// program committees
const CommitteesContainer = styled.div`
  margin-bottom: 1.56rem;
`;

const OuterList = styled.ul`
  list-style-type: none;
  margin-left: 0;
  margin-bottom: 10px;
`;

const InnerList = styled.ul`
  margin-bottom: 10px;
  margin-top: 10px;
  color: white;
`;

const CommitteeItem = styled.li`
  margin: 0;
`;

const CommitteesBlock = ({ data }) => (
  <CommitteesContainer>
    {
      data.map(({ theme, committees }) => (
        <OuterList key={theme}>
          <CommitteeItem>
            <TopicHeading hideTrailingDot>
              {theme}
            </TopicHeading>
            <br />
            <InnerList>
              <CommitteeItem>
                <ContentText>
                  {
                    committees.map(({ fullname, institution }, ind) => (
                      <React.Fragment key={fullname}>
                        {fullname}
                        <EmphasizedText>
                          {` (${institution})`}
                        </EmphasizedText>
                        {ind !== committees.length - 1 && ', '}
                      </React.Fragment>
                    ))
                  }
                </ContentText>
              </CommitteeItem>
            </InnerList>
          </CommitteeItem>
        </OuterList>
      ))
    }
  </CommitteesContainer>
);

CommitteesBlock.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

// -- MAIN
export default () => {
  const {
    title,
    description,
    longDescription,
    // conferenceTitle,
    // conferenceDescription,
    mainConfDate,
    registrationDate,
    submissionDate,
    // unconferenceDate,
    twitter,
    // crowdcast,
  } = useSiteMetadata();

  const committteesData = useProgramCommitteesData();

  return (
    <Layout>
      <DarkBackgroundStyle />
      <HeaderBlock>
        <TitleHeading>{title}</TitleHeading>
        <SubtitleHeading notBold>
          {description}
        </SubtitleHeading>
        <ContentText>
          {longDescription}
        </ContentText>
        <SepLine />
        <SubtitleHeading>Registration &amp; Submission</SubtitleHeading>
        <ContentText>
          <TopicHeading>Registration date</TopicHeading>
          {registrationDate}
          <br />
          <TopicHeading>Submission date</TopicHeading>
          {submissionDate}
          {' | '}
          We welcome all abstracts in any topic area
          within neuroscience!
          <br />
          <TopicHeading>Main Conference</TopicHeading>
          {mainConfDate}
          <br />
          <TopicHeading>Agenda</TopicHeading>
          Available on
          {' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://neural-reckoning.github.io/nmc3_provisional_schedule/"
          >
            Static Agenda
          </a>
          {' | '}
          <Link to="/agenda">
            Agenda
          </Link>
          {' | '}
          <Link to="/abstract-browser">
            Abstract Browser
          </Link>
          <br />
          <TopicHeading>Registration Fees</TopicHeading>
          $25 | Pay after registration on
          {' '}
          <Link to="/payment">
            payment page
          </Link>
          , fee waiver is available, free for non-scientists
          <br />
          <Fa icon={['fab', 'twitter']} />
          {' · '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={twitter.url}
          >
            {twitter.hashtag}
          </a>
        </ContentText>
        <SepLine />
        <SubtitleHeading>Program Committees</SubtitleHeading>
        <CommitteesBlock data={committteesData} />
        <SepLine />
        <SubtitleHeading>Neuromatch Career</SubtitleHeading>
        <ContentText>
          In this conference, we also provide a virtual job board
          for job posters and job seekers. Please see navigation
          bar above to post your job, find your job, or view
          conference job board.
        </ContentText>
        <ContentText>
          <TopicHeading>Job Board</TopicHeading>
          Please check out job board
          {' '}
          <Link to="/jobs/job-board">
            here
          </Link>
          <br />
          <TopicHeading>Job Poster</TopicHeading>
          Please post your job
          {' '}
          <Link to="/jobs/job-poster">
            here
          </Link>
          <br />
          <TopicHeading>Job Seeker</TopicHeading>
          Please register
          {' '}
          <Link to="/jobs/job-seeker">
            here
          </Link>
          {' '}
          if you are looking for jobs
        </ContentText>
      </HeaderBlock>
      <GoalBlock>
        <Container padBottom>
          <SubtitleHeading>Our goals</SubtitleHeading>
          <GoalsArray>{goals.map((goal) => renderGoal(goal))}</GoalsArray>
        </Container>
      </GoalBlock>
      <SponsorBlock>
        <Container padBottom>
          <SubtitleHeading>Organizers and Sponsors</SubtitleHeading>
          <SponsorsArray>
            {sponsors.map((spon) => renderSponsor(spon))}
          </SponsorsArray>
        </Container>
      </SponsorBlock>
    </Layout>
  );
};
