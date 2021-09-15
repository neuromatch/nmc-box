/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { navigate } from "gatsby"
// import moment from 'moment';
import PropTypes from "prop-types"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Controller, ErrorMessage, useForm } from "react-hook-form"
import styled from "styled-components"
// import {
//   ButtonsContainer,
//   FormButton,
// } from '../../components/BaseComponents/Buttons';
import LoadingView from "../components/BaseComponents/LoadingView"
import Toast, { toastTypes } from "../components/BaseComponents/Toast"
import { ControlSelect } from "../components/FormComponents/SelectWrapper"
import {
  FormContainer,
  InputContainer,
  RequiredIcon,
  WarningMessage,
} from "../components/FormComponents"
import Layout from "../components/layout"
import useValidateRegistration from "../hooks/useValidateRegistration"
import { media } from "../styles"
import { useAuthenFetchGet } from "../hooks/useFetch"
import { reactSelectHelpers, timePickerHelpers } from "../utils"
import useSiteMetadata from "../hooks/gql/useSiteMetadata"
import AvailableTimePicker from "../components/AvailableTimePicker"
import {
  ButtonsContainer,
  FormButton,
} from "../components/BaseComponents/Buttons"
import useFirebaseWrapper from "../hooks/useFirebaseWrapper"

// -- CONSTANTS
const talkFormatOptions = ["Traditional talk", "Interactive talk"]

// -- COMPONENTS
const TopicHeading = ({ children }) => <b>{`${children} · `}</b>

TopicHeading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

const SubLabel = styled.label`
  font-size: 14.4px;
  line-height: 17px;
  margin: 2px 0 8px;
  font-style: italic;
`

export default () => {
  const [isSending, setIsSending] = useState(false)
  const [isExpired, setIsExpired] = useState(null)

  useEffect(() => {
    // TODO:
    // implement logic to prevent new submission base on registration ending day
    setIsExpired(false)
  }, [])

  // site metadata
  const { submissionDate } = useSiteMetadata()
  // get user info
  const { isValidating, isRegistered, prevUserData } = useValidateRegistration()
  const { isLoggedIn } = useFirebaseWrapper()

  // manage form using hooks
  const {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    setError,
  } = useForm()
  const dynamicToastControl = useRef(null)

  // get existing submission (if there is) to render as default values
  const { result: currentSubmission } = useAuthenFetchGet(
    prevUserData?.submission_id
      ? `/api/abstract/{edition}/${prevUserData?.submission_id}`
      : undefined,
    {}
  )

  // set default values in each field
  useEffect(() => {
    let timeoutRef

    if (
      currentSubmission &&
      currentSubmission?.constructor === Object &&
      Object.keys(currentSubmission).length > 0
    ) {
      // select components have to wait them rendered before setValue
      timeoutRef = setTimeout(() => {
        setValue([
          {
            talkFormatSelect: reactSelectHelpers.saveFormatToOptions(
              currentSubmission?.talk_format
            ),
          },
          {
            theme: reactSelectHelpers.saveFormatToOptions(
              currentSubmission?.theme
            ),
          },
          {
            topic: reactSelectHelpers.saveFormatToOptions(
              currentSubmission?.topic
            ),
          },
        ])
      }, 2500)

      // the rest don't need to wait
      setValue([
        {
          availableDatetimePicker: timePickerHelpers.deserializeSelectedDatetime(
            currentSubmission?.available_dt
          ),
        },
        { coauthors: currentSubmission?.coauthors },
        { title: currentSubmission?.title },
        { abstract: currentSubmission?.abstract },
      ])
    }

    // clear timeout on unmount
    return () => clearTimeout(timeoutRef)
  }, [currentSubmission, setValue])

  const onSubmit = data => {
    setIsSending(true)

    const { talkFormatSelect, availableDatetimePicker, ...restData } = data

    const numberOfSlots = 5
    const pickNotEnoughAvailableTime =
      availableDatetimePicker.reduce((acc, cur) => acc.concat(cur.time), [])
        .length < numberOfSlots

    // if no datetime is selected, set form error and do not submit to the server
    if (Array.isArray(availableDatetimePicker) && pickNotEnoughAvailableTime) {
      setError(
        "availableDatetimePicker",
        "isRequired",
        `Available Watching Time is required at least ${numberOfSlots} slots.`
      )
      setIsSending(false)
      return
    }

    const readyData = {
      fullname: prevUserData.fullname,
      email: prevUserData.email,
      institution: prevUserData.institution,
      talk_format: reactSelectHelpers.optionsToSaveFormat(talkFormatSelect),
      available_dt: timePickerHelpers.serializeSelectedDatetime(
        availableDatetimePicker
      ),
      arxiv: prevUserData.arxiv,
      ...restData,
    }

    fetch("/api/abstract/{edition}/{submission_id}", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(readyData),
    })
      .then(res => {
        if (res.ok) {
          // scroll to top
          window &&
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "smooth",
            })
          // // send confirmation email
          // // dont send email now
          // fetch('/api/confirmation/submission', {
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
            "You have successfully submitted the abstract to Neuromatch Conference."
          )
        } else {
          // show not success toast
          dynamicToastControl.current.show(
            toastTypes.error,
            `Something went wrong with status ${res.status}, please contact the admin.`
          )
        }
        // reset
        setIsSending(false)
      })
      .catch(err => {
        console.log(err)

        dynamicToastControl.current.show(
          toastTypes.error,
          `Something went wrong with error ${err}, please contact us.`
        )
        // reset
        setIsSending(false)
      })
  }

  if (isLoggedIn === false) {
    setTimeout(() => {
      navigate("/")
    }, 2500)

    return (
      <LoadingView message="You are not logged in, redirecting to homepage.." />
    )
  }

  if (isValidating) {
    return <LoadingView />
  }

  if (isRegistered === false) {
    setTimeout(() => {
      navigate("/")
    }, 2500)

    return (
      <LoadingView message="You are not registered, please register before submitting abstract.." />
    )
  }

  // fullname, email, co-authors, title, abstract, talk formats, arxiv
  return (
    <Layout>
      <Toast ref={dynamicToastControl} />
      <h2>Abstract submission form</h2>
      <p>
        Neuromatch conference 3.0 welcomes all abstracts in any topic area
        within computational neuroscience! Abstracts will be screened only for
        obvious topical irrelevance to the neuroscience community. For each
        title and abstract submitted, the submitter will select the presentation
        format <em>traditional talk</em> or
        <em>interactive talk</em>.
      </p>
      <h3>Traditional Talks</h3>
      <p>
        will be scheduled for a single <em>15 minutes time slot</em>, consisting
        of a <em>12 minutes presentation</em> and <em>3 minutes of Q&amp;A</em>
        . Speakers are expected to show up 5 minutes before their session starts
        and attend the full session to allow for great discussions.
        <br />
      </p>
      <h3>Interactive talks</h3>
      <p>
        will be a single <em>roughly 5 minute introduction to the research</em>{" "}
        followed by a <em> 10 minute discussion</em>. This format is meant to
        allow more intensive discussions and feel similar to poster
        presentations in traditional conferences. There will be 5-7 such
        presentations in a 2-hours block. Every presenter is expected to attend
        the whole 2 hours and participate in the discussions.
      </p>
      <p>
        All abstracts are limited to 300 words and are assigned to one of the
        themes. Each submission will require the submitter to indicate the time
        slots where they are available to attend. Each abstract submitter must
        also participate in the abstract feedback process after the submission
        window where one indicates which abstracts one is are most interested in
        attending, which also helps us make individualized schedules. Abstracts
        will be viewed without author names or institutions to increase fairness
        and reduce prestige bias. This information will be used to aid in
        determining the conference schedule.{" "}
        <em>
          Abstracts will be withdrawn and not presented if the submitter does
          not participate in the feedback period.
        </em>
      </p>
      <p>
        <TopicHeading>Submission deadline</TopicHeading>
        {submissionDate}
        <br />
        <TopicHeading>Note</TopicHeading>
        We only allow one submission per attendee. An additional submission will
        replace the former one.
      </p>
      {isExpired === true && (
        <p
          style={{ textAlign: "center", color: "#ee1133", fontWeight: "bold" }}
        >
          The submission is now closed (already pass the deadline on
          {` ${submissionDate})`}
        </p>
      )}
      {isExpired === false && (
        <FormContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p>
              <TopicHeading>Author</TopicHeading>
              {`${prevUserData.firstname} ${prevUserData.lastname}`}
              <br />
              <TopicHeading>Email</TopicHeading>
              {prevUserData.email}
              <br />
              <TopicHeading>Affiliation</TopicHeading>
              {prevUserData.institution}
            </p>
            <InputContainer>
              <label>
                Talk format
                <RequiredIcon />
              </label>
              <ControlSelect
                name="talkFormatSelect"
                control={control}
                options={talkFormatOptions.map(k => ({
                  value: k,
                  label: k,
                }))}
                placeholder="Select talk format"
                allowCreate={false}
                isRequired="Talk format is required."
              />
              <ErrorMessage
                errors={errors}
                name="talkFormatSelect"
                as={<WarningMessage />}
              />
            </InputContainer>
            <InputContainer>
              <label>Coauthors</label>
              <SubLabel>Put your coauthor each separated with ;</SubLabel>
              <input
                type="text"
                placeholder="name1, affiliation1; name2, affiliation2; ..."
                name="coauthors"
                ref={register()}
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
                  required: "Title is required.",
                })}
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
                  required: "Abstract is required.",
                })}
              />
              <ErrorMessage
                errors={errors}
                name="abstract"
                as={<WarningMessage />}
              />
            </InputContainer>
            <InputContainer>
              <label>Link to Arxiv, BioArxiv, MedArxiv, or PsycArxiv</label>
              <SubLabel>
                If you want to include preprint in NMC submission, please add
                the URLs here separated by ;. You can opt-in to have your
                comments/discussion on BioArxiv after the event.
              </SubLabel>
              <input
                type="text"
                placeholder="url1; url2; ..."
                name="arxiv"
                ref={register()}
              />
            </InputContainer>
            <InputContainer>
              <label>
                Available Presentation Date-Time
                <RequiredIcon />
              </label>
              <SubLabel>
                Please select timezone based on your location or preferred
                timezone. The form will be updated according to your chosen
                location. Please select as many slots as you can. The more slots
                you select, the larger your audience is likely to be. In extreme
                cases, we may not be able to fit your talk into the schedule if
                you only select a very small number of slots.
              </SubLabel>
              <Controller
                name="availableDatetimePicker"
                as={<AvailableTimePicker />}
                control={control}
                rules={{
                  required: "Available Presentation Date-Time is required.",
                }}
              />
              <ErrorMessage
                errors={errors}
                name="availableDatetimePicker"
                as={<WarningMessage />}
              />
            </InputContainer>
            <ButtonsContainer>
              <FormButton
                as="input"
                value={isSending ? "Sending.." : "Submit"}
                disabled={isSending}
              />
            </ButtonsContainer>
          </form>
        </FormContainer>
      )}
    </Layout>
  )
}
