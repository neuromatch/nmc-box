// import { navigate } from 'gatsby';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { ReactSVG } from 'react-svg';
import styled, { css } from 'styled-components';
import { Container } from '../components/BaseComponents/container';
import Layout from '../components/layout';
import useProgramCommitteesData from '../hooks/gql/useProgramCommitteesData';
import useSiteMetadata from '../hooks/gql/useSiteMetadata';
import { growOverParentPadding, media } from '../styles';
import { useThemeContext } from '../styles/themeContext';
import { color } from '../utils';
import Fa from '../utils/fontawesome';

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
    dark: require('../../static/logos/sponsors/dark/upenn-official-logo.png'),
    light: require('../../static/logos/sponsors/light/upenn-official-logo.png'),
    text: 'University of Pennsylvania',
  },
  {
    dark: require('../../static/logos/sponsors/dark/imperial-official-logo.png'),
    light: require('../../static/logos/sponsors/light/imperial-official-logo.png'),
    text: 'Imperial College London',
  },
  {
    dark: require('../../static/logos/sponsors/dark/penn-state-logo.png'),
    light: require('../../static/logos/sponsors/light/penn-state-logo.png'),
    text: 'Penn State University',
  },
  {
    dark: require('../../static/logos/sponsors/dark/georgia-tech-logo.png'),
    light: require('../../static/logos/sponsors/light/georgia-tech-logo.png'),
    text: 'Georgia Tech Institute of Technology',
  },
  {
    dark: require('../../static/logos/sponsors/dark/ist-austria-logo.png'),
    light: require('../../static/logos/sponsors/light/ist-austria-logo.png'),
    text: 'IST Austria',
  },
  {
    dark: require('../../static/logos/sponsors/dark/imbb-forth-logo.png'),
    light: require('../../static/logos/sponsors/light/imbb-forth-logo.png'),
    text: 'IMBB Forth',
  },
  {
    dark: require('../../static/logos/sponsors/dark/uc-irvine-logo.png'),
    light: require('../../static/logos/sponsors/light/uc-irvine-logo.png'),
    text: 'UC Irvine',
  },
];

// -- COMPONENTS
// const DarkBackgroundStyle = createGlobalStyle`
//   body {
//     background-color: #222;
//   }
// `;

const HeaderBlock = styled.div`
  padding-bottom: 20px;
`;

const TitleHeading = styled.h1`
  color: ${p => p.theme.colors.secondary};
  font-size: 72px;

  /* scale according to screen width */
  ${media.extraSmall`
    font-size: 16vw;
  `}
`;

const SubtitleHeading = styled.h3`
  color: ${p => p.theme.colors.secondary};
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
      color: ${p => p.theme.colors.secondary};
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
  color: ${p => color.scale(p.theme.colors.secondary, p.theme.colors.factor * -5)};
`;

const EmphasizedText = styled.span`
  font-style: italic;
`;

const SepLine = styled.hr`
  background-color: ${p => p.theme.colors.secondary};
`;

const GoalBlock = styled.div`
  text-align: center;
  background-color: ${p => color.scale(p.theme.colors.primary, p.theme.colors.factor * 3.5)};

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
  fill: ${p => p.theme.colors.secondary};
`;

const GoalLogo = ({ item }) => (
  <EachGoal>
    <StyledSVG src={item.svg} />
    <ContentText>{item.text}</ContentText>
  </EachGoal>
);

GoalLogo.propTypes = {
  item: PropTypes.shape({
    svg: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
};

const SponsorBlock = styled(GoalBlock)`
  background-color: ${p => color.scale(p.theme.colors.primary, p.theme.colors.factor * 3.5)};
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

const SponsorLogo = ({ item }) => {
  const { theme } = useThemeContext();

  return (
    <EachSponsor>
      <StyledImg src={item[theme.toLowerCase()]} />
    </EachSponsor>
  );
};

SponsorLogo.propTypes = {
  item: PropTypes.shape({
    dark: PropTypes.node,
    light: PropTypes.node,
    text: PropTypes.string,
  }).isRequired,
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
  color: ${p => p.theme.colors.secondary};
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
      {/* <DarkBackgroundStyle /> */}
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
      </HeaderBlock>
      <GoalBlock>
        <Container padBottom>
          <SubtitleHeading>Our goals</SubtitleHeading>
          <GoalsArray>
            {goals.map((goal) => <GoalLogo key={goal.text} item={goal} />)}
          </GoalsArray>
        </Container>
      </GoalBlock>
      <SponsorBlock>
        <Container padBottom>
          <SubtitleHeading>Organizers and Sponsors</SubtitleHeading>
          <SponsorsArray>
            {sponsors.map((spon) => <SponsorLogo key={spon.text} item={spon} />)}
          </SponsorsArray>
        </Container>
      </SponsorBlock>
    </Layout>
  );
};
