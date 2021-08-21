// import { navigate } from 'gatsby';
import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { ReactSVG } from "react-svg"
import styled from "styled-components"
import { Container } from "../components/BaseComponents/container"
import Layout from "../components/layout"
import useProgramCommitteesData from "../hooks/gql/useProgramCommitteesData"
import useSiteMetadata from "../hooks/gql/useSiteMetadata"
import { growOverParentPadding, media } from "../styles"
import { useThemeContext } from "../styles/themeContext"
import { color } from "../utils"
import Fa from "../utils/fontawesome"

// -- CONSTANTS
const goals = [
  {
    svg: "svgs/icons/neuromatch_icon_AIMatching.svg",
    text: "Simplify conferences, reduce meeting and travel costs",
  },
  {
    svg: "svgs/icons/neuromatch_icon_CarbonFootprint.svg",
    text: "Reduce carbon emissions",
  },
  {
    svg: "svgs/icons/neuromatch_icon_conference.svg",
    text: "Find new ideas or collaborators",
  },
]

const sponsors = [
  {
    dark: require("../../static/logos/sponsors/dark/upenn-official-logo.png"),
    light: require("../../static/logos/sponsors/light/upenn-official-logo.png"),
    text: "University of Pennsylvania",
  },
  {
    dark: require("../../static/logos/sponsors/dark/imperial-official-logo.png"),
    light: require("../../static/logos/sponsors/light/imperial-official-logo.png"),
    text: "Imperial College London",
  },
  {
    dark: require("../../static/logos/sponsors/dark/penn-state-logo.png"),
    light: require("../../static/logos/sponsors/light/penn-state-logo.png"),
    text: "Penn State University",
  },
  {
    dark: require("../../static/logos/sponsors/dark/georgia-tech-logo.png"),
    light: require("../../static/logos/sponsors/light/georgia-tech-logo.png"),
    text: "Georgia Tech Institute of Technology",
  },
  {
    dark: require("../../static/logos/sponsors/dark/ist-austria-logo.png"),
    light: require("../../static/logos/sponsors/light/ist-austria-logo.png"),
    text: "IST Austria",
  },
  {
    dark: require("../../static/logos/sponsors/dark/imbb-forth-logo.png"),
    light: require("../../static/logos/sponsors/light/imbb-forth-logo.png"),
    text: "IMBB Forth",
  },
  {
    dark: require("../../static/logos/sponsors/dark/uc-irvine-logo.png"),
    light: require("../../static/logos/sponsors/light/uc-irvine-logo.png"),
    text: "UC Irvine",
  },
]

// -- COMPONENTS
const MainBlock = styled.section`
  padding-bottom: 1.56rem;
  /* margin-bottom: 1.56rem; */
`

const TitleHeading = styled.h1`
  font-size: 72px;

  /* scale according to screen width */
  ${media.extraSmall`
    font-size: 16vw;
  `}
`

const TopicHeading = ({ children }) => <b>{`${children} · `}</b>

TopicHeading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

const GoalBlock = styled.section`
  text-align: center;
  background-color: ${p =>
    color.scale(p.theme.colors.primary, p.theme.colors.factor * 3.5)};

  /* grow full width */
  ${growOverParentPadding(100)}
`

const GoalsArray = styled.div`
  display: flex;
  justify-content: space-between;

  /* show goals vertically in smaller screen */
  ${media.small`
    justify-content: center;
    flex-wrap: wrap;
  `}
`

const EachGoal = styled.div`
  width: 250px;
`

const StyledSVG = styled(ReactSVG)`
  margin: 0 auto 10px;
  height: 200px;
  width: 200px;
  fill: ${p => p.theme.colors.secondary};
`

const GoalLogo = ({ item }) => (
  <EachGoal>
    <StyledSVG src={item.svg} />
    <span>{item.text}</span>
  </EachGoal>
)

GoalLogo.propTypes = {
  item: PropTypes.shape({
    svg: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
}

const SponsorBlock = styled(GoalBlock)`
  background-color: ${p =>
    color.scale(p.theme.colors.primary, p.theme.colors.factor * 3.5)};
`

const SponsorsArray = styled(GoalsArray)`
  justify-content: space-evenly;
  flex-wrap: wrap;
`

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
`

const StyledImg = styled.img`
  margin: 15px auto 10px;
  max-height: 100px;
`

const SponsorLogo = ({ item }) => {
  const { theme } = useThemeContext()

  return (
    <EachSponsor>
      <StyledImg src={item[theme.toLowerCase()]} />
    </EachSponsor>
  )
}

SponsorLogo.propTypes = {
  item: PropTypes.shape({
    dark: PropTypes.node,
    light: PropTypes.node,
    text: PropTypes.string,
  }).isRequired,
}

// program committees
const CommitteesBlock = ({ data }) => (
  <>
    {data.map(({ theme, committees }) => (
      <dl key={theme}>
        <dt>{theme}</dt>
        <dd>
          {committees.map(({ fullname, institution }, ind) => (
            <React.Fragment key={fullname}>
              {fullname}
              <i>{` (${institution})`}</i>
              {ind !== committees.length - 1 && ", "}
            </React.Fragment>
          ))}
        </dd>
      </dl>
    ))}
  </>
)

CommitteesBlock.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
}

// -- MAIN
export default () => {
  const {
    title,
    description,
    longDescription,
    mainConfDate,
    registrationDate,
    submissionDate,
    twitter,
  } = useSiteMetadata()

  const committteesData = useProgramCommitteesData()

  return (
    <Layout>
      <MainBlock>
        <TitleHeading>{title}</TitleHeading>
        <section>
          <h3>{description}</h3>
          <p>{longDescription}</p>
        </section>
        <hr />
        <section>
          <h3>Registration &amp; Submission</h3>
          <p>
            <TopicHeading>Registration date</TopicHeading>
            {registrationDate}
            <br />
            <TopicHeading>Submission date</TopicHeading>
            {submissionDate}
            {" | "}
            We welcome all abstracts in any topic area within neuroscience!
            <br />
            <TopicHeading>Main Conference</TopicHeading>
            {mainConfDate}
            <br />
            <TopicHeading>Agenda</TopicHeading>
            Available on{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://neural-reckoning.github.io/nmc3_provisional_schedule/"
            >
              Static Agenda
            </a>
            {" | "}
            <Link to="/agenda">Agenda</Link>
            {" | "}
            <Link to="/abstract-browser">Abstract Browser</Link>
            <br />
            <TopicHeading>Registration Fees</TopicHeading>
            $25 | Pay after registration on{" "}
            <Link to="/payment">payment page</Link>
            , fee waiver is available, free for non-scientists
            <br />
            <Fa icon={["fab", "twitter"]} />
            {" · "}
            <a target="_blank" rel="noopener noreferrer" href={twitter.url}>
              {twitter.hashtag}
            </a>
          </p>
        </section>
        <hr />
        <section>
          <h3>Program Committees</h3>
          <CommitteesBlock data={committteesData} />
        </section>
      </MainBlock>
      <GoalBlock>
        <Container padBottom>
          <h3>Our goals</h3>
          <GoalsArray>
            {goals.map(goal => (
              <GoalLogo key={goal.text} item={goal} />
            ))}
          </GoalsArray>
        </Container>
      </GoalBlock>
      <SponsorBlock>
        <Container padBottom>
          <h3>Organizers and Sponsors</h3>
          <SponsorsArray>
            {sponsors.map(spon => (
              <SponsorLogo key={spon.text} item={spon} />
            ))}
          </SponsorsArray>
        </Container>
      </SponsorBlock>
    </Layout>
  )
}
