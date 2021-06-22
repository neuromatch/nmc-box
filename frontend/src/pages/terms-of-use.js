import React from 'react';
import styled from 'styled-components';
import CommonPageStyles from '../components/BaseComponents/CommonPageStyles';
import Layout from '../components/layout';

const BrandFont = styled.span`
  font-weight: bold;
  font-size: 1.1em;
  color: #000;
  font-family: "Nunito";

  /* add space without having to &nbsp; */
  &::before,
  &::after {
    content: " ";
  }
`;

export default () => (
  <Layout>
    <CommonPageStyles>
      <h2>Terms and Conditions of Use</h2>
      <p>
        Welcome to our terms and conditions that you agree to by using our
        pages. For our
        <BrandFont>neuromatch</BrandFont>
        conference, we try to collect minimal data that we need for our matching
        algorithm and for public communication. The data will not be shared
        elsewhere outside of the organizers (Kording lab at the University of
        Pennsylvania) but may be used for public communication. The data will be
        used for research purpose but may also be shared in any other form
        during or after the conference.
      </p>
      <p>
        Please read it carefully before signing up for the conference. If you
        have further question please contact the conference organizers at
        <code>&nbsp;nmc@neuromatch.io</code>
        .
      </p>

      <ol>
        <li>
          <h3>Acceptance of the terms of use</h3>
          <ol type="a">
            <li>
              These terms of use are entered into by and between you and
              <BrandFont>neuromatch</BrandFont>
              conference.
            </li>
            <li>
              Please read the Terms of Use carefully before you start using the
              site. By signing up for the conference, you accept and agree to be
              bound and abide by these Terms of Use.
            </li>
          </ol>
        </li>

        <li>
          <h3>Eligibility</h3>
          <ol type="a">
            <li>You are 18 years or older</li>
            <li>
              You must be a human, working on research in neuroscience or a
              related area
            </li>
            <li>
              All the information you submit to
              <BrandFont>neuromatch</BrandFont>
              must be truthful and accurate.
            </li>
            <li>
              You will maintain the security of your account and password.
              <BrandFont>neuromatch</BrandFont>
              will not be liable for any loss or damage from your failure to
              comply with this security obligation
            </li>
          </ol>
        </li>

        <li>
          <h3>Privacy Policy</h3>
          <ol type="a">
            <li>
              The privacy policy applies when you sign up for the conference or
              use any of our pages.
            </li>
            <li>
              We collect information from 3 ways: directly from your input, from
              third-party sources, and through automated algorithms that we
              implement.
            </li>
            <ul>
              <li>
                We use third-party sign-up where we only ask for primitive
                information. We are not responsible for the other personal
                information through the third party service.
              </li>
            </ul>
            <li>
              You agree to make this information available for research purposes
              including for publication and/or communication relating to the
              conference.
            </li>
          </ol>
        </li>

        <li>
          <h3>Termination</h3>
          <p>
            We reserve the right to cancel or remove you from the conference if
            we see that you are not providing the correct information about
            yourself or trying to spam the conference.
          </p>

          <p>
            You have the right to ask for your removal of the data from our
            servers and remove yourself from the conference. When asked by email
            to the listed address we will do our best to remove all information
            about you in a timely fashion.
          </p>
        </li>

        <li>
          <h3>Changes to this privacy policy</h3>
          <p>
            The organizers may change this privacy policy from time to time. As
            we mentioned, we try to minimize the use of your personal data. If
            you do not agree with the policy, you can deactivate your account by
            emailing us at
            <code>&nbsp;nmc@neuromatch.io&nbsp;</code>
            anytime.
          </p>
        </li>
      </ol>

      <h2>Code of Conduct for All Participants</h2>

      <h3>
        By registering for and attending
        <BrandFont>neuromatch</BrandFont>
        conference, participants agree to:
      </h3>

      <ol>
        <li>
          Treat fellow meeting participants, staff, and organizers with respect,
          civility, fairness, without bias based on sex, gender, gender identity
          or expression, sexual orientation, race, ethnicity, color, religion,
          nationality or national origin, citizenship status, disability status,
          veteran status, marital or partnership status, age, genetic
          information, or any other criteria prohibited under applicable
          federal, state or local law.
        </li>
      </ol>

      <h3>Similarly, meeting participants agree to refrain from:</h3>

      <ol>
        <li>
          Harassment and discrimination in violation of Laboratory policy based
          on sex, gender, gender identity or expression, sexual orientation,
          race, ethnicity, color, religion, nationality or national origin,
          citizenship status, disability status, veteran status, marital or
          partnership status, age, genetic information, or any other criteria
          prohibited under applicable federal, state or local law.
        </li>
        <li>
          Sexual harassment, sexual misconduct, unwanted verbal abuse with
          others.
        </li>
        <li>
          Disrespectful, uncivil and/or unprofessional interpersonal behavior
          that interferes with the working and learning environment.
        </li>
      </ol>

      <h3>Breaches or Violations of the Code of Conduct</h3>
      <p>
        The organizers and their institutions aim to maintain a conference
        environment in accordance with the principles and expectations outlined
        in this Code of Conduct. Meeting organizers and staff can approach
        anyone with breaches or violations via social media and/or personal
        contact. Breaches or violations should be reported via email to
      </p>

      <ul>
        <li>
          Dr. Konrad Kording, University of Pennsylvania,
          <code>&nbsp;koerding@gmail.com</code>
        </li>

        <li>
          <BrandFont>neuromatch</BrandFont>
          organizers,
          <code>&nbsp;nmc@neuromatch.io</code>
        </li>
      </ul>
    </CommonPageStyles>
  </Layout>
);
