/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { navigate } from 'gatsby';
// import moment from 'moment';
import PropTypes from 'prop-types';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { Controller, ErrorMessage, useForm } from 'react-hook-form';
import styled from 'styled-components';
// import {
//   ButtonsContainer,
//   FormButton,
// } from '../../components/BaseComponents/Buttons';
import LoadingView from '../../components/BaseComponents/LoadingView';
import Toast, { toastTypes } from '../../components/BaseComponents/Toast';
import { ControlSelect } from '../../components/FormComponents/SelectWrapper';
import {
  FormContainer,
  InputContainer,
  RequiredIcon,
  WarningMessage,
} from '../../components/FormComponents';
import Layout from '../../components/layout';
import useSfnTopicsData from '../../hooks/gql/useSfnTopicsData';
import useValidateRegistration from '../../hooks/useValidateRegistration';
import { media } from '../../styles';
import { useAuthenFetchGet } from '../../hooks/useFetch';
import { reactSelectHelpers, timePickerHelpers } from '../../utils';
import useSiteMetadata from '../../hooks/gql/useSiteMetadata';
import AvailableTimePicker from './components/AvailableTimePicker';

// -- CONSTANTS
const talkFormatOptions = [
  'Traditional talk',
  'Interactive talk',
];

// -- COMPONENTS
const EmphasizedText = styled.span`
  font-style: italic;
  text-decoration: underline;
`;

const TopicHeading = ({ children }) => (
  <span
    css={`
      font-size: 1.05em;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.8);
    `}
  >
    {children}
    {' '}
  </span>
);

TopicHeading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

const SelectsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  /* on large screen we render theme and topic in half */
  & > ${InputContainer} {
    flex: 1;

    :not(:last-child) {
      margin-right: 15px;
    }
  }

  /* on small screen we render them full line */
  ${media.medium`
    flex-direction: column;

    & > ${InputContainer} {
      :not(:last-child) {
        margin-right: 0px;
      }
    }
  `}
`;

const SubLabel = styled.label`
  font-size: 14.4px;
  line-height: 17px;
  margin: 2px 0 8px;
  font-style: italic;
`;

export default () => {
  // site metadata
  const { submissionDate } = useSiteMetadata();
  // get SFN themes and topics to be picked in the dropdown
  const { sfnThemes } = useSfnTopicsData();
  // get user info
  const {
    currentUserInfo,
    isLoggedIn,
    isRegistered,
    prevUserData,
  } = useValidateRegistration();

  // manage form using hooks
  const {
    register, handleSubmit, errors, control, watch,
    setValue, getValues, setError,
  } = useForm();
  const dynamicToastControl = useRef(null);
  const [, setIsSending] = useState(false);

  // get existing submission (if there is) to render as default values
  const { result: currentSubmission } = useAuthenFetchGet(
    prevUserData?.submission_id
      ? `/api/get_submission?submission_id=${prevUserData?.submission_id}`
      : undefined,
    {},
  );

  // set default values in each field
  useEffect(() => {
    let timeoutRef;

    if (currentSubmission
      && currentSubmission?.constructor === Object
      && Object.keys(currentSubmission).length > 0) {
      // select components have to wait them rendered before setValue
      timeoutRef = setTimeout(() => {
        setValue([
          {
            talkFormatSelect: reactSelectHelpers
              .saveFormatToOptions(currentSubmission?.talk_format),
          },
          { theme: reactSelectHelpers.saveFormatToOptions(currentSubmission?.theme) },
          { topic: reactSelectHelpers.saveFormatToOptions(currentSubmission?.topic) },
        ]);
      }, 2500);

      // the rest don't need to wait
      setValue([
        {
          availableDatetimePicker: timePickerHelpers
            .deserializeSelectedDatetime(currentSubmission?.available_dt),
        },
        { coauthors: currentSubmission?.coauthors },
        { title: currentSubmission?.title },
        { abstract: currentSubmission?.abstract },
      ]);
    }

    // clear timeout on unmount
    return () => clearTimeout(timeoutRef);
  }, [currentSubmission, setValue]);

  // watch theme to filter topics
  const watchTheme = watch('theme');

  // themes doesn't need to do anything
  const themesData = useMemo(
    () => sfnThemes.map((theme) => ({
      label: theme,
      value: theme,
    })),
    [sfnThemes],
  );

  useEffect(() => {
    const currentTheme = watchTheme?.value;
    const currentTopic = getValues()?.topic?.value;

    // if no theme yet do nothing
    if (currentTheme && currentTopic) {
      const themeKey = currentTheme.match(/Theme ([A-Z]):.*/)?.[1];

      if (!currentTopic.startsWith(themeKey)) {
        // reset selected topic to prevent selecting
        // topic of different theme only when theme
        // and topic doesn't match
        setValue('topic', []);
      }
    }
  }, [getValues, setValue, watchTheme]);

  const onSubmit = (data) => {
    setIsSending(true);

    const {
      talkFormatSelect,
      theme,
      preferDates,
      preferTimes,
      availableDatetimePicker,
      ...restData
    } = data;

    const numberOfSlots = 5;
    const pickNotEnoughAvailableTime = availableDatetimePicker
      .reduce((acc, cur) => acc.concat(cur.time), []).length < numberOfSlots;

    // if no datetime is selected, set form error and do not submit to the server
    if (
      Array.isArray(availableDatetimePicker)
      && pickNotEnoughAvailableTime
    ) {
      setError(
        'availableDatetimePicker',
        'isRequired',
        `Available Watching Time is required at least ${numberOfSlots} slots.`,
      );
      setIsSending(false);
      return;
    }

    const readyData = {
      id: currentUserInfo.uid,
      payload: {
        fullname: prevUserData.fullname,
        email: prevUserData.email,
        institution: prevUserData.institution,
        talk_format: reactSelectHelpers.optionsToSaveFormat(talkFormatSelect),
        theme: reactSelectHelpers.optionsToSaveFormat(theme),
        available_dt: timePickerHelpers.serializeSelectedDatetime(availableDatetimePicker),
        ...restData,
      },
    };

    fetch('/api/set_submission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(readyData),
    })
      .then((res) => {
        if (res.ok) {
          // scroll to top
          window
            && window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth',
            });
          // // send confirmation email
          // // dont send email now
          // fetch('/api/send_submission_email', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //     id: currentUserInfo.uid,
          //   }),
          // })
          //   .then((submissionConRes) => {
          //     // if (submissionConRes.ok) {
          //     //   console.log('email sent!');
          //     // }
          //   })
          //   .catch((err) => console.log('[/send_submission_email]', err));
          // show success toast
          dynamicToastControl.current.show(
            toastTypes.success,
            'Thank you so much! You have successfully submitted the abstract.',
          );
        } else {
          // show not success toast
          dynamicToastControl.current.show(
            toastTypes.error,
            `Something went wrong with status ${res.status}, please contact us.`,
          );
        }
        // reset
        setIsSending(false);
      })
      .catch((err) => {
        console.log(err);

        dynamicToastControl.current.show(
          toastTypes.error,
          `Something went wrong with error ${err}, please contact us.`,
        );
        // reset
        setIsSending(false);
      });
  };

  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate('/');
    }, 2500);

    return (
      <LoadingView message="You are not logged in, redirecting to homepage.." />
    );
  }

  if (isRegistered === false) {
    setTimeout(() => {
      navigate('/');
    }, 2500);

    return (
      <LoadingView message="You are not registered, please register before submitting abstract.." />
    );
  }

  if (isRegistered) {
    // fullname, email, Co-authors, title, abstract, talk formats
    return (
      <Layout>
        <Toast ref={dynamicToastControl} />
        <h2>Abstract submission form</h2>
        <p>
          Neuromatch conference 3.0 welcomes all abstracts in any topic area within
          neuroscience! Abstracts will be screened only for obvious topical
          irrelevance to the neuroscience community. For each title and
          abstract submitted, the submitter will select the presentation format
          {' '}
          <EmphasizedText>traditional talk</EmphasizedText>
          {' '}
          or
          {' '}
          <EmphasizedText>interactive talk</EmphasizedText>
          .
        </p>
        <p>
          <TopicHeading>Traditional Talks</TopicHeading>
          will be scheduled for a single
          {' '}
          <EmphasizedText>15 minutes time slot</EmphasizedText>
          {' '}
          , consisting of a
          {' '}
          <EmphasizedText>12 minutes presentation</EmphasizedText>
          {' '}
          and
          {' '}
          <EmphasizedText>3 minutes of Q&amp;A</EmphasizedText>
          .
          Speakers are expected to show up 5 minutes before their session starts
          and attend the full session to allow for great discussions.
          <br />
          <TopicHeading>Interactive  talks</TopicHeading>
          will be a single
          {' '}
          <EmphasizedText>roughly 5 minute introduction to the research</EmphasizedText>
          {' '}
          followed by a
          {' '}
          <EmphasizedText> 10 minute discussion</EmphasizedText>
          . This format is meant to allow more intensive discussions and feel similar
          to poster presentations in traditional conferences. There will be 5-7 such
          presentations in a 2-hours block. Every presenter is expected to attend
          the whole 2 hours and participate in the discussions.
        </p>
        <p>
          All abstracts are limited to 300 words and are assigned to one of the themes.
          Each submission will require the submitter to
          indicate the time slots where they are available to attend. Each abstract submitter must
          also participate in the abstract feedback process after the submission
          window where one indicates which abstracts one is are most interested
          in attending, which also helps us make individualized schedules. Abstracts will be
          viewed without author names or institutions to increase fairness and
          reduce prestige bias. This information will be used to aid in
          determining the conference schedule.
          {' '}
          <EmphasizedText>
            Abstracts will be withdrawn and not presented if the submitter does
            not participate in the feedback period.
          </EmphasizedText>
        </p>
        <p>
          <TopicHeading>Submission deadline: </TopicHeading>
          {` · ${submissionDate}`}
          <br />
          <TopicHeading>Note</TopicHeading>
          {' · '}
          We only allow one submission per attendee. An additional submission
          will replace the former one.
        </p>
        <p style={{ textAlign: 'center', color: '#ee1133', fontWeight: 'bold' }}>
          The submission is now closed (already pass the deadline on
          {` ${submissionDate})`}
        </p>
        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p>
              <TopicHeading>Author</TopicHeading>
              {` · ${prevUserData.fullname}`}
              <br />
              <TopicHeading>Email</TopicHeading>
              {` · ${prevUserData.email}`}
              <br />
              <TopicHeading>Affiliation</TopicHeading>
              {` · ${prevUserData.institution}`}
            </p>
            <InputContainer>
              <label>
                Talk format
                <RequiredIcon />
              </label>
              <ControlSelect
                name="talkFormatSelect"
                control={control}
                options={talkFormatOptions.map((k) => ({
                  value: k,
                  label: k,
                }))}
                placeholder="Select talk format"
                allowCreate={false}
                isRequired="Talk format is required."
                disabled
              />
              <ErrorMessage
                errors={errors}
                name="talkFormatSelect"
                as={<WarningMessage />}
              />
            </InputContainer>
            <InputContainer>
              <label>Coauthors</label>
              <SubLabel>
                Put your coauthor each separated with ;
              </SubLabel>
              <input
                type="text"
                placeholder="name1, affiliation1; name2, affiliation2; ..."
                name="coauthors"
                ref={register()}
                disabled
              />
            </InputContainer>
            {/* use textinput */}
            <InputContainer>
              <label>
                Title
                <RequiredIcon />
              </label>
              <input
                type="text"
                placeholder="Please put title of your talk here"
                name="title"
                ref={register({
                  required: 'Title is required.',
                })}
                disabled
              />
              <ErrorMessage
                errors={errors}
                name="title"
                as={<WarningMessage />}
              />
            </InputContainer>
            {/* use textarea */}
            <InputContainer>
              <label>
                Abstract
                <RequiredIcon />
              </label>
              <textarea
                css={`
                  resize: vertical;
                `}
                name="abstract"
                placeholder="Please put your abstract here (suggested < 300 words)"
                rows="8"
                ref={register({
                  required: 'Abstract is required.',
                })}
                disabled
              />
              <ErrorMessage
                errors={errors}
                name="abstract"
                as={<WarningMessage />}
              />
            </InputContainer>
            <SelectsRow>
              <InputContainer>
                <label>
                  Theme
                  <RequiredIcon />
                </label>
                <ControlSelect
                  name="theme"
                  control={control}
                  options={themesData}
                  placeholder="Select theme"
                  isRequired="Theme is required."
                  allowCreate={false}
                  disabled
                />
                <ErrorMessage
                  errors={errors}
                  name="theme"
                  as={<WarningMessage />}
                />
              </InputContainer>
            </SelectsRow>
            <InputContainer>
              <label>
                Available Presentation Date-Time
                <RequiredIcon />
              </label>
              <SubLabel>
                Please select timezone based on your location or
                preferred timezone. The form will be updated
                according to your chosen location. Please select
                as many slots as you can. The more slots you select,
                the larger your audience is likely to be. In extreme
                cases, we may not be able to fit your talk into the
                schedule if you only select a very small number of
                slots.
              </SubLabel>
              <Controller
                name="availableDatetimePicker"
                as={<AvailableTimePicker />}
                control={control}
                rules={{ required: 'Available Presentation Date-Time is required.' }}
              />
              <ErrorMessage
                errors={errors}
                name="availableDatetimePicker"
                as={<WarningMessage />}
              />
            </InputContainer>
            {/* <ButtonsContainer>
              <FormButton
                as="input"
                value={isSending ? 'Sending..' : 'Submit'}
                disabled={isSending}
              />
            </ButtonsContainer> */}
          </form>
        </FormContainer>
      </Layout>
    );
  }

  return <LoadingView />;
};
