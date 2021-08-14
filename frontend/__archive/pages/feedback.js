/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import StarScore from '../../src/components/FormComponents/StarScore';
import {
  CheckboxBlock,
  InputBlock,
  StarScoreBlock,
  FormWrapper,
  UncontrolledCheckbox,
} from '../../src/components/FormComponents/StyledFormComponents';
import Layout from '../../src/components/layout';
import { useAuthenFetchPost } from '../../src/hooks/useFetch';
import useFirebaseWrapper from '../../src/hooks/useFirebaseWrapper';
import Toast, { toastTypes } from '../../src/components/BaseComponents/Toast';
import LoadingView from '../../src/components/BaseComponents/LoadingView';
import { ButtonsContainer, FormButton } from '../../src/components/BaseComponents/Buttons';
// import { generateFakeMatchPartners } from '../utils/fake';
import Card from '../../src/components/BaseComponents/Card';

const BoldText = styled.span`
  font-weight: bold;
`;

const RateMatchPartnerContainer = styled.div`
  ${CheckboxBlock} {
    height: 45px;
    display: flex;
    justify-content: center;
    margin: 0;
  }
`;

const RateEventContainer = styled.div`
  ${StarScoreBlock} {
    display: block;
  }

  textarea {
    margin-top: 0.25em;
  }

  hr {
    margin: 1em 0;
  }
`;

const RateMatchPartnerBox = ({ fullname, email, register }) => (
  <Card>
    <RateMatchPartnerContainer>
      <p>
        Your match:
        {' '}
        <BoldText>{fullname}</BoldText>
        <br />
        Email:
        {' '}
        <BoldText>{email}</BoldText>
      </p>
      <StarScoreBlock>
        <label>Research Relevance :</label>
        <StarScore name={`feedback_score['${email}']['relevance_score']`} register={register} />
      </StarScoreBlock>
      <StarScoreBlock>
        <label>How useful was this meeting? :</label>
        <StarScore name={`feedback_score['${email}']['satisfaction_score']`} register={register} />
      </StarScoreBlock>
      <CheckboxBlock>
        <UncontrolledCheckbox
          name={`feedback_score['${email}']['acquaintance']`}
          register={register}
        />
        <label>Did you already know this person before?</label>
      </CheckboxBlock>
    </RateMatchPartnerContainer>
  </Card>
);

export default () => {
  // get user info
  const { currentUserInfo: user } = useFirebaseWrapper();
  const { result: fetchResult, isLoading } = useAuthenFetchPost(
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
  } = fetchResult;

  // mock data
  // const matchPartners = generateFakeMatchPartners(6);

  const { register, handleSubmit } = useForm();
  const toastControl = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const onSubmit = (data) => {
    const readyData = {
      id: user.uid,
      payload: {
        email: user.email,
        ...data,
      },
    };

    fetch('/api/set_user_feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(readyData),
    })
      .then((x) => {
        // scroll to top
        window
          && window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        // show toast
        toastControl.current.show();
        // reset
        setIsSending(false);
      })
      .catch((err) => {
        console.log(err);
        // reset
        setIsSending(false);
      });
  };

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <Layout>
      <Toast
        message="Thank you so much! You have successcully submitted the feedback."
        type={toastTypes.success}
        ref={toastControl}
      />
      <h2>neuromatch feedback form</h2>
      <p>
        Thanks for participating neuromatch conference!
        Here, please fill in the feedback form for the conference.
      </p>
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          {matchPartners.length > 0 ? (
            <>
              <h3>Feedback for the match</h3>
              <p>This is a feedback form for the neuromatch 2020. For each match, you can rate</p>
              <ol>
                <li>research relevance in the scale 1 to 5</li>
                <li>the satisfaction of the match you get in the scale 1 to 5</li>
              </ol>
              <p>
                where 1 means the least relevance or least satisfactory and 5 means highly
                satisfactory or highly relevance. We also list their email addresses, just in case
                they are useful for you to follow up on your discussions.
              </p>
              {matchPartners.length > 0 ? (
                <div>
                  {matchPartners.map(({ email, fullname }) => (
                    <RateMatchPartnerBox
                      key={email}
                      fullname={fullname}
                      email={email}
                      register={register}
                    />
                  ))}
                </div>
              ) : null}
            </>
          ) : null}

          <h3>Feedback for the conference</h3>
          <Card>
            <RateEventContainer>
              <StarScoreBlock>
                <label>
                  How useful neuromatch conference was to you? (1=not useful, 10=very useful):
                </label>
                <StarScore name="useful" register={register} maxScore={10} />
              </StarScoreBlock>
              <StarScoreBlock>
                <label>
                  How enjoyable neuromatch conference was to you? (1=not enjoyable, 10=very
                  enjoyable):
                </label>
                <StarScore name="enjoyable" register={register} maxScore={10} />
              </StarScoreBlock>
              <hr />
              <InputBlock>
                <label>Any topics you want to explore in the next conference?</label>
                <textarea
                  name="feedback_topics"
                  placeholder="Type your feedback here.."
                  rows={4}
                  ref={register}
                />
              </InputBlock>
              <InputBlock>
                <label>
                  Any feedback for the main conference (Crowdcast, Google docs)?
                  What else can we make it better?
                </label>
                <textarea
                  name="feedback_main"
                  placeholder="Type your feedback here.."
                  rows={4}
                  ref={register}
                />
              </InputBlock>
              <InputBlock>
                <label>
                  Any feedback for the mind-matching part of the conference (optional if you
                  participate)?
                </label>
                <textarea
                  name="feedback_mind_matching"
                  placeholder="Type your feedback here.."
                  rows={4}
                  ref={register}
                />
              </InputBlock>
              <InputBlock>
                <label>
                  Put your additional feedback here
                  (e.g. overall experience, the format we use, ...)
                </label>
                <textarea
                  name="feedback_additional"
                  placeholder="Type your feedback here.."
                  rows={4}
                  ref={register}
                />
              </InputBlock>
            </RateEventContainer>
          </Card>
          <ButtonsContainer>
            <FormButton
              as="input"
              value={isSending
                ? 'Sending..'
                : 'Submit'}
              disabled={isSending}
            />
          </ButtonsContainer>
        </form>
      </FormWrapper>
    </Layout>
  );
};
