import { Link } from "gatsby"
import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
// import useSiteMetadata from '../../hooks/gql/useSiteMetadata';

const StyledImg = styled.img`
  border-radius: 5px;
  border: 1px solid ${p => p.theme.colors.secondary};
  padding: 3px;
  margin-top: 10px;
  width: 85%;
`

export default () => {
  // const { mainConfDate, twitter } = useSiteMetadata();

  return (
    <Layout>
      <h2>Registration Instructions</h2>
      <section>
        <h3>Registration &#47; Signup</h3>
        <ul>
          <li>
            You can register on top of this page for{" "}
            <b>neuromatch conference</b> using your email, Gmail, or GitHub
            handle.
            <br />
            <StyledImg
              src={require("../../../static/instructions/profile.png")}
              alt="profile"
            />
          </li>
          <li>
            If you previously signed up for <b>neuromatch conferences</b>, you
            still have to{" "}
            <a href="/edit-profile" target="_blank" rel="noopener noreferrer">
              edit your profile
            </a>{" "}
            under your log-in profile to register for{" "}
            <b>neuromatch 3.0 conference</b>.
          </li>
          <li>
            After signing up, provide basic information about you, including
            your abstracts if you want to participate in the{" "}
            <b>mind-matching</b> (1-on-1 matching) part of the conference.
          </li>
          <li>
            You can always come back to edit your profile anytime before the
            registration ends.
          </li>
          <li>
            Make sure to choose if you want to participate in the matching
            component. That is where the fun is. But make sure you do it before
            the registration ends.
          </li>
          <li>
            After the registration ends, we will perform a matching algorithm.
            You will have an access to <a href="/your-matches">your matches</a>{" "}
            under your profile to see your partners.
          </li>
        </ul>
      </section>
      <hr />
      <section>
        <h3>Registration Fees</h3>
        <p>
          Registration is required to attend the conference, including to have
          an abstract presented.{" "}
          <em>
            The registration fee is $25 per person and a fee waiver is available
          </em>{" "}
          for those who cannot have their fee covered by either their
          institution, company, or lab and cannot pay on their own (no
          validation necessary) or lack the technical means to use our payment
          portal. Consistent with our values of making the meeting accessible as
          possible, we have minimizedthe cost to attend while still providing
          the financial support necessary to increase the scope and impact of
          the meeting beyond previous offerings. With the fee waiver, we want to
          explicitly guarantee that no one is unable to participate due to
          funding status.
          <StyledImg
            src={require("../../../static/instructions/payment.png")}
            alt="profile"
          />
        </p>
      </section>
      <hr />
      <section>
        <h3>Mind-matching Instructions (1-on-1 meeting)</h3>
        <p>
          We use machine learning algorithm to match conference attendees
          together for one-on-one meeting, so called &quot;mind-matching&quot;.
          To sign up, opt-in to the matching part to matching part in your
          registration profile and provide us your representative abstract.
          <StyledImg
            src={require("../../../static/instructions/mind-match-reg.png")}
            alt="profile"
          />
        </p>
        <h3>Mind-Matching Preparation</h3>
        <section>
          <h4>1. Preparation</h4>
          <ol type="a">
            <li>
              If you signed up for mind-match, we will send your match partners
              on <Link to="/your-matches">your matches page</Link> a few days
              after the registration ends. You will get who your partners are
              and suggestions on how to e-meet them before, during, or after the
              main conference.
            </li>
            <li>
              You can exchange emails with your match partners to organize a
              time and meeting platforms (Skype/Zoom/etc.) beforehand. Please
              don&apos;t forget to include your timezone!
            </li>
            <li>
              You and your match are responsible for setting up the
              conversation, we just arrange the matches.
            </li>
          </ol>
        </section>
        <section>
          <h4>2. Before the meeting with your match</h4>
          <ol type="a">
            <li>
              Have a quick look at your partner’s webpage or list of
              publications (a link will be included in the email we send you),
              but there is no expectation that you will read their papers.
            </li>
            <li>
              Think about how to quickly describe your research interests
              bearing in mind your partner’s background. This is particularly
              important for interdisciplinary meetings.
            </li>
          </ol>
        </section>
        <section>
          <h4>3. During the meeting</h4>
          <p>
            We recommend the following, but feel free to structure your meeting
            however you like.
          </p>
          <ol type="a">
            <li>
              Start by each of you talking for 1 - 2 minutes about your general
              interests and approach.
            </li>
            <li>
              If you immediately see a point of connection, go for it and talk
              about that.
            </li>
            <li>
              Feel free to use screen-sharing and your slides if you think they
              help.
            </li>
            <li>
              If not, try each of you describing briefly one or two projects
              that you think would be relevant or interesting to the other one,
              and see if that sparks an interesting discussion.
            </li>
            <li>
              Keep in mind, the idea is to give yourselves the best chance of
              finding an unexpected and useful connection, so think broadly and
              try to get across a range of ideas until you find something that
              gets you both excited that you can talk about in more detail.
            </li>
            <li>
              Please be kind and respectful during your meeting (see more on our
              code of conduct page).
            </li>
            <li>
              Don’t worry if you don’t find something, our algorithms aren’t
              perfect and you’re not being judged on how well you do - have fun!
            </li>
          </ol>
        </section>
      </section>
      <hr />
      <section>
        <h3>Further questions</h3>
        <p>
          If you have further questions, please consult our{" "}
          <Link to="/faq">FAQ page</Link> first. If you cannot find your
          solution, you can contact us at <code>nmc@neuromatch.io</code>
        </p>
      </section>
    </Layout>
  )
}
