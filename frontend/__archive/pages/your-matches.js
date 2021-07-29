/* eslint-disable react/prop-types */
import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import Layout from '../components/layout';
import CommonPageStyles from '../components/BaseComponents/CommonPageStyles';
import { useAuthenFetchPost } from '../hooks/useFetch';
import useValidateRegistration from '../hooks/useValidateRegistration';
import Fa from '../utils/fontawesome';
// import { generateFakeMatches } from '../utils/fake';

const EachInfoContainer = styled.span`
  font-size: 0.675em;
  margin-right: 6px;
`;

/**
 * AdditionalInfo
 * @param {Object} props
 * @param {('googleScholar'|'personalPage'|'meetingPlatform')} props.type
 * @param {String} props.infoText
 * @param {String} props.icon
 */
const AdditionalInfo = ({ type, infoText, icon }) => {
  let inContent;

  if (type === 'googleScholar' || type === 'personalPage') {
    inContent = (
      <a
        href={infoText}
        target="_blank"
        rel="noreferrer"
      >
        {type === 'googleScholar' && 'Google Scholar'}
        {type === 'personalPage' && 'Personal Page'}
      </a>
    );
  }

  if (type === 'meetingPlatform') {
    inContent = infoText;
  }

  // do not display the ones with no data
  if (!inContent || !infoText) {
    return null;
  }

  return (
    <EachInfoContainer>
      <Fa icon={icon} />
      {' '}
      {inContent}
    </EachInfoContainer>
  );
};

export default () => {
  const { currentUserInfo: user, prevUserData } = useValidateRegistration();
  const { result: fetchResult } = useAuthenFetchPost(
    '/api/get_user_match_info',
    {
      mind_match: [],
      group_match: [],
    },
    user
      ? {
        id: user.uid,
      }
      : undefined,
  );

  const {
    mind_match: matchPartners,
    group_match: groupPartners,
  } = fetchResult;

  // fake data to test
  // const {
  //   mind_match: matchPartners,
  //   group_match: groupPartners,
  // } = generateFakeMatches(6);

  return (
    <Layout>
      <CommonPageStyles>
        <h2>Your matches</h2>
        {matchPartners.length > 0 ? (
          <>
            <h3>Mind-matching partners</h3>
            <p>
              Below is a list of your mind-matching partner. Please arrange a
              meeting with them and consult our
              {' '}
              <Link to="/instructions/how-to-register">instructions</Link>
              {' '}
              page before meeting.
            </p>
            <ul>
              {matchPartners.map(({
                email, fullname,
                meeting_platform: meetingPlatform,
                google_scholar: googleScholar,
                personal_page: personalPage,
              }) => (
                <li key={email}>
                  {`${fullname} - ${email}`}
                  <br />
                  <div css="display: flex; flex-direction: row;">
                    <AdditionalInfo
                      type="personalPage"
                      icon={['far', 'user']}
                      infoText={personalPage}
                    />
                    <AdditionalInfo
                      type="googleScholar"
                      icon={['fab', 'google']}
                      infoText={googleScholar}
                    />
                    <AdditionalInfo
                      type="meetingPlatform"
                      icon="chalkboard-teacher"
                      infoText={meetingPlatform.split(';').join(', ')}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {groupPartners.length > 0 ? (
          <>
            <h3>Group-matching partners (Grouped Mind)</h3>
            <p>
              Below is a list of your group during the conference. Please
              arrange a meeting with them during the conference. You can also
              arrange the meeting anytime after the conference.
            </p>
            <ul>
              {groupPartners.map(({ email, fullname }) => (
                <li key={email}>
                  {`${fullname} - ${email}`}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {matchPartners.length === 0
        && groupPartners.length === 0
          ? prevUserData?.participate_mind_match
            ? (
              <p>
                We will put your matches here soon before the conference!
              </p>
            )
            : (
              <p>
                Looks like you haven&apos;t participated in the mind-matching session.
                Please update your profile and add an abstract in your profile if you
                want to participate.
              </p>
            )
          : null}
      </CommonPageStyles>
    </Layout>
  );
};
