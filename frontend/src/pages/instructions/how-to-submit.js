import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import useSiteMetadata from "../../hooks/gql/useSiteMetadata"

const StyledImg = styled.img`
  border-radius: 5px;
  border: 1px solid ${p => p.theme.colors.secondary};
  padding: 3px;
  margin-top: 10px;
  width: 85%;
`

const TopicHeading = ({ children }) => <b>{`${children} · `}</b>

TopicHeading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

export default () => {
  const { submissionDate } = useSiteMetadata()

  return (
    <Layout>
      <h2>Submission instructions</h2>
      <p>
        Neuromatch 3.0 welcomes all abstracts in any topic area within
        neuroscience! Please register and submit your abstract under your
        profile (
        <a
          href="/abstract-submission"
          target="_blank"
          rel="noopener noreferrer"
        >
          submission button
        </a>{" "}
        is located on the top-right of the page).
      </p>
      <p>
        Abstracts will be screened only for obvious topical irrelevance to the
        neuroscience community. For each title and abstract submitted, the
        submitter will select the presentation format{" "}
        <em>traditional talk presentation</em> or{" "}
        <em>interactive talk presentation</em>.
      </p>
      <StyledImg
        src={require("../../../static/instructions/submission.png")}
        alt="profile"
      />
      <p>
        <b>Traditional Talks</b> will be scheduled for a single{" "}
        <em>15 minutes time slot</em>, consisting of a{" "}
        <em>12 minutes presentation</em> and <em>3 minutes of Q&amp;A</em>
        . Speakers are expected to show up 5 minutes before their session starts
        and attend the full session to allow for great discussions.
        <br />
        <b>Interactive talks</b> will be a single{" "}
        <em>roughly 5 minute introduction to the research</em> followed by a{" "}
        <em>10 minute discussion</em>. This format is meant to allow more
        intensive discussions and feel similar to poster presentations in
        traditional conferences. There will be 5-7 such presentations in a
        2-hours block. Every presenter is expected to attend the whole 2 hours
        and participate in the discussions.
      </p>
      <p>
        All abstracts are limited to <em>300 words</em> and topical keywords
        will be chosen upon submission. Each submission will be accompanied by
        indicating the time slots where one is available to attend the
        conference (for presentation or viewing). Each abstract submitter must
        also participate in the abstract feedback process after the submission
        window where one indicates which abstracts one is are most interested in
        attending (aided by our matching algorithms). Abstracts will be viewed
        without author names or institutions to increase fairness and reduce
        prestige bias. This information will be used to aid in determining the
        conference schedule.{" "}
        <em>
          Abstracts will be withdrawn and not presented if the submitter does
          not participate in the feedback period.
        </em>
      </p>
      <hr />
      <p>
        <TopicHeading>Submission date</TopicHeading>
        {submissionDate}
        <br />
        <TopicHeading>Note</TopicHeading>
        We only allow one submission per attendee. An additional submission will
        replace the former one.
      </p>
    </Layout>
  )
}
