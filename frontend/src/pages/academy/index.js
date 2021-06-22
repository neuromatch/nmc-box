import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import styled, { createGlobalStyle } from 'styled-components';
import { Container } from '../../components/BaseComponents/container';
import { AcademyLayout } from '../../components/layout';
import useAcademyMetadata from '../../hooks/gql/useAcademyMetadata';
import Fa from '../../utils/fontawesome';
import { media, Mixins } from '../../utils/ui';

const academyInfo = {
  title: 'Neuromatch Academy',
  description: 'An online school for Computational Neuroscience.',
  image: 'https://neuromatch.io/academy-og-img.png',
  url: 'https://neuromatch.io/academy',
  googleVerification: 'ZgQmgE9kvbiXj4-w0l1Z5hkCOMd6TujszQ6vHNAK85U',
};

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
`;

const TopicHeading = ({ children }) => (
  <span
    css={`
      font-size: 1.05em;
      font-weight: bold;
      color: #eaeaea;
    `}
  >
    {children}
    {' · '}
  </span>
);

TopicHeading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

const ContentText = styled.p`
  color: #e0e0e0;
`;

const SepLine = styled.hr`
  background-color: white;
`;

const ObjectivesBlock = styled.div`
  text-align: center;
  background-color: #333;
  margin-bottom: 1.56rem;

  /* grow full width */
  ${Mixins.growOverParentPadding(100)}
`;

const ObjectivesArray = styled.div`
  display: flex;
  justify-content: space-between;

  /* show goals vertically in smaller screen */
  ${media.small`
    justify-content: center;
    flex-wrap: wrap;
  `}
`;

const EachObjective = styled.div`
  width: 250px;

  font-size: 0.85em;

  border: 1px solid #111;
  border-radius: 5px;
  padding: 40px 20px 30px;
  margin: 0 10px;

  :first-child {
    margin-left: 0;
  }

  :last-child {
    margin-right: 0;
  }

  ${media.small`
    margin: 0;
  `}

  box-shadow: 0px 0px 2px 2px #555;

  .icon {
    font-size: 3.75em;
    margin-bottom: 25px;
    color: #fff;
  }

  p {
    /* remove default margin */
    margin: 0;
  }
`;

const renderObjective = ({ icon, text }) => (
  <EachObjective key={icon}>
    <Fa className="icon" icon={icon} />
    <ContentText>{text}</ContentText>
  </EachObjective>
);

renderObjective.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

const SponsorBlock = styled(ObjectivesBlock)`
  background-color: #333;
  margin-bottom: 0;
`;

const SponsorsArray = styled(ObjectivesArray)`
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

const EachPresentingSponsor = styled.div`
  ${media.extraLarge`
    width: ${1140 / 2}px;
  `}
  ${media.large`
    width: ${960 / 3}px;
  `}
  ${media.small`
    width: ${720 / 3}px;
  `}

  display: flex;
  align-items: center;
  margin: 0 20px;
`;

const StyledImg = styled.img`
  margin: 15px auto 10px;
  max-height: 100px;
`;

const StyledPresentingImg = styled.img`
  margin: 15px auto 10px;
  max-height: 250px;
`;

const presentingSponsors = [
  {
    require: require('../../../static/facebook-reality-lab-logo.png'),
    text: 'Facebook Reality Lab',
  },
];

const sponsors = [
  {
    require: require('../../../static/upenn-official-logo-for-dark.png'),
    text: 'University of Pennsylvania',
  },
  {
    require: require('../../../static/mindcore-logo.png'),
    text: 'mindCORE',
  },
  {
    require: require('../../../static/uc-irvine-logo.png'),
    text: 'UC Irvine',
  },
  {
    require: require('../../../static/queens-logo.png'),
    text: 'Queens',
  },
  {
    require: require('../../../static/penn-state-logo.png'),
    text: 'Penn State University',
  },
  {
    require: require('../../../static/umn-logo.png'),
    text: 'University of Minnesota',
  },
  {
    require: require('../../../static/cifar-logo.png'),
    text: 'CIFAR',
  },
  {
    require: require('../../../static/ieee-brain-logo.png'),
    text: 'IEEE Brain',
  },
  {
    require: require('../../../static/simons-foundation-logo.png'),
    text: 'Simon Foundation',
  },
  {
    require: require('../../../static/templeton-world-logo.png'),
    text: 'Templeton World Charity Foundation',
  },
  {
    require: require('../../../static/kavli-logo.png'),
    text: 'The Kavli Foundation',
  },
  {
    require: require('../../../static/thinktheory.png'),
    text: 'Columbia University Center for Theoretical Neuroscience',
  },
  {
    require: require('../../../static/TCCI-logo.png'),
    text: 'Tianqiao & Chrissy Chen Institute',
  },
  {
    require: require('../../../static/wellcome-logo.png'),
    text: 'Wellcome Foundation',
  },
  // {
  //   require: require('../../static/ucl-logo.png'),
  //   text: 'University College London',
  // },
  {
    require: require('../../../static/gatsby-logo.png'),
    text: 'Gatsby Computational Neuroscience',
  },
  {
    require: require('../../../static/bernstein-logo.png'),
    text: 'Bernstein Network',
  },
  // {
  //   require: require('../../static/nsf-logo.png'),
  //   text: 'National Science Foundation',
  // },
  {
    require: require('../../../static/nbdt-logo.png'),
    text: 'Neurons, Behavior, Data analysis, and Theory',
  },
  {
    require: require('../../../static/hhmi-logo.png'),
    text: 'Janelia Research Campus (HHMI)',
  },
  {
    require: require('../../../static/incf-logo.png'),
    text: 'INCF',
  },
  {
    require: require('../../../static/deepmind-logo.png'),
    text: 'DeepMind',
  },
];

// eslint-disable-next-line react/prop-types
const renderSponsor = ({ require, text }) => (
  <EachSponsor key={text}>
    <StyledImg src={require} />
  </EachSponsor>
);

// eslint-disable-next-line react/prop-types
const renderPresentingSponsor = ({ require, text }) => (
  <EachPresentingSponsor key={text}>
    <StyledPresentingImg src={require} />
  </EachPresentingSponsor>
);

renderSponsor.propTypes = {
  text: PropTypes.string.isRequired,
};

renderPresentingSponsor.propTypes = {
  text: PropTypes.string.isRequired,
};

const objectives = [
  {
    icon: 'toolbox',
    text: 'Introduce traditional and emerging computational neuroscience tools',
  },
  {
    icon: 'laptop-code',
    text: 'Learn hands-on skills with neuro data',
  },
  {
    icon: 'lightbulb',
    text: 'Understand how these tools relate to biological questions',
  },
  {
    icon: 'handshake',
    text: (
      <>
        Build networking, professional development, and
        {' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.eneuro.org/content/7/1/ENEURO.0352-19.2019"
        >
          how-to-model
        </a>
        {' '}
        skills
      </>
    ),
  },
];

export default () => {
  const {
    key,
    academyTitle,
    academyDescription,
    schoolDate,
    twitter,
    missionStatementUrl,
    contactEmail,
    syllabusUrl,
  } = useAcademyMetadata();

  return (
    <AcademyLayout>
      {/* only put those to be overrided in this Helmet */}
      <Helmet>
        {/* General tags */}
        <title>{academyInfo.title}</title>
        <meta name="description" content={academyInfo.description} />
        <meta name="image" content={academyInfo.image} />
        <link rel="canonical" href={academyInfo.url} />
        <meta name="google-site-verification" content={academyInfo.googleVerification} />

        {/* OpenGraph tags */}
        <meta property="og:title" content={academyInfo.title} />
        <meta property="og:description" content={academyInfo.description} />
        <meta property="og:image" content={academyInfo.image} />
        <meta property="og:url" content={academyInfo.url} />

        {/* Twitter Card tags */}
        <meta name="twitter:title" content={academyInfo.title} />
        <meta name="twitter:description" content={academyInfo.description} />
        <meta name="twitter:image" content={academyInfo.image} />
      </Helmet>
      <DarkBackgroundStyle />
      <HeaderBlock>
        <TitleHeading>{`${academyTitle} ${key}`}</TitleHeading>
        <SubtitleHeading>{academyDescription}</SubtitleHeading>
        <ContentText>
          Started by the team who created
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.compneurosci.com/CoSMo/"
          >
            CoSMo summer school
          </a>
          ,
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.ccnss.org"
          >
            CCN SS
          </a>
          ,
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://imbizo.africa"
          >
            Simons IBRO
          </a>
          ,
          {' '}
          and neuromatch conference
          , we announce a worldwide academy to train neuroscientists to learn
          computational tools, make connections to real world neuroscience
          problems, and promote networking with researchers.
          <br />
          Please see our
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://neuromatchacademy.github.io/pdfs/To%20the%20NMA%20Community.pdf"
          >
            message to the NMA community
          </a>
          {' '}
          about our involvement with Iranian residents.
          <br />
          <TopicHeading>For Current Interactive Students</TopicHeading>
          Please visit our
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/NeuromatchAcademy/course-content"
          >
            github page
          </a>
          {' '}
          for all up-to-date course content. The discussion forum for
          students is hosted by
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://neurostars.org/c/neuromatch-academy"
          >
            Neurostars.
          </a>
          {' '}
          The student portal for administrative matters will be coming shortly.
        </ContentText>
        <ObjectivesBlock>
          <Container padBottom>
            <SubtitleHeading>Objectives</SubtitleHeading>
            <ObjectivesArray>
              {objectives.map((obj) => renderObjective(obj))}
            </ObjectivesArray>
          </Container>
        </ObjectivesBlock>
        <ContentText>
          <TopicHeading>Audience</TopicHeading>
          undergraduate, graduate, postdoctoral, professors; experimentalists
          and computational neuroscientists (all tutorials will have beginners,
          intermediate and advanced components)
          <br />
          <TopicHeading>Registration</TopicHeading>
          The application period for Interactive students is now
          closed. You can sign up as an Observer by filling out this
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://semtsinghua.au1.qualtrics.com/jfe/form/SV_bw1ycypJliGHaVD"
          >
            form.
          </a>
          {' '}
          Observers do not get TA guidance but can sign up to be matched into
          groups with fellow Observers and work on tutorials together.
          <br />
          <TopicHeading>Prerequisite</TopicHeading>
          Python, basic math, introductory neuroscience.
          Please see
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/NeuromatchAcademy/precourse"
          >
            Github repository
          </a>
          {' '}
          for precourse reading.
          <br />
          <TopicHeading>School</TopicHeading>
          {schoolDate}
          <br />
          <TopicHeading>Mission statement</TopicHeading>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={missionStatementUrl}
          >
            See statement here
          </a>
          <br />
          <TopicHeading>
            <Fa icon="dollar-sign" />
          </TopicHeading>
          Small fee for full-time students/academics, with fee waivers available
          <br />
          <TopicHeading>
            <Fa icon="users" />
          </TopicHeading>
          Megan Peters (UC Irvine), Konrad Kording (UPenn), Gunnar Blohm
          (Queen’s), Paul Schrater (UMN), Brad Wyble (Penn State), Sean
          Escola (Columbia), and the Neuromatch Academy team
          <br />
          <TopicHeading>
            <Fa icon={['fab', 'twitter']} />
          </TopicHeading>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/neuromatch"
          >
            Neuromatch Academy
          </a>
          ,
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={twitter.url}
          >
            {twitter.hashtag}
          </a>
          <br />
          <TopicHeading>
            <Fa icon="envelope" />
          </TopicHeading>
          {contactEmail}
        </ContentText>
        <SepLine />
        <ContentText>
          <TopicHeading>Overall Structure</TopicHeading>
          Signals (Week 1), Statistics, Behaviors, Neurons (Week 2), Machine
          Learning and advance approaches (Week 3)
          <br />
          <TopicHeading>Participation options</TopicHeading>
          1) Interactive track - access to courses and teaching materials, TAs,
          mentors, careers, projects
          2) Non-interactive track - access to courses and materials
          <br />
          <TopicHeading>Micro Structure</TopicHeading>
          4 hours lectures and hands-on Python tutorials (with TAs!), 1 hour
          interpretation (what did we learn today, what does it mean, underlying
          philosophy), 1 hour professional development/meta-science, networking
          activities, evening 3-week small group projects (with how-to-model
          mentoring).
          <br />
          <TopicHeading>Social activities</TopicHeading>
          Aside from lectures and tutorials, there will be social and
          professional events. This aims to help participants, to plan their
          career (e.g. find postdocs, negotiate, startups, early career), do
          professional networking, discuss collaborations, exchange experiences.
          We will also arrange one-on-one meetings with professors and fellow
          researchers based on participants preference and their expertise
          (matchmaking).
        </ContentText>
        <SepLine />
        <ContentText>
          <TopicHeading>TAs</TopicHeading>
          TAs help participants with tutorials and 3-week small-group projects.
          <br />
          <br />
          <TopicHeading>Mentors</TopicHeading>
          We also need help from faculty members, senior postdocs, and members
          of industry who are knowledgeable about neuroscience,
          mathematics, cognitive science, and other related fields to provide
          mentorship to students. If you are interested in contributing in
          this way, please fill out
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://semtsinghua.au1.qualtrics.com/jfe/form/SV_eVfkK52NATb06ah"
          >
            this form
          </a>
          .
        </ContentText>
        <SepLine />
        <SubtitleHeading>Syllabus</SubtitleHeading>
        <ContentText>
          Please see the syllabus
          {' '}
          <a target="_blank" rel="noopener noreferrer" href={syllabusUrl}>
            here
          </a>
          .
        </ContentText>
        <SepLine />
        <SubtitleHeading>FAQ</SubtitleHeading>
        <ContentText>
          If you have further questions, please read our
          {' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="/academy/faq"
          >
            FAQ page
          </a>
          {' '}
          before sending specific questions.
        </ContentText>
      </HeaderBlock>
      <SponsorBlock>
        <Container padBottom>
          <SubtitleHeading>Presenting Sponsor</SubtitleHeading>
          <SponsorsArray>
            {presentingSponsors.map((org) => renderPresentingSponsor(org))}
          </SponsorsArray>
        </Container>
      </SponsorBlock>
      <SponsorBlock>
        <Container padBottom>
          <SubtitleHeading>Organizers and Sponsors</SubtitleHeading>
          <SponsorsArray>
            {sponsors.map((spon) => renderSponsor(spon))}
          </SponsorsArray>
        </Container>
      </SponsorBlock>
    </AcademyLayout>
  );
};
