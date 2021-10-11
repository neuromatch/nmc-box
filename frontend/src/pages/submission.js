/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { navigate, Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Controller, ErrorMessage, useForm } from "react-hook-form"
import styled from "styled-components"
import AvailableTimePicker from "../components/AvailableTimePicker"
import {
  ButtonsContainer,
  FormButton,
} from "../components/BaseComponents/Buttons"
import LoadingView from "../components/BaseComponents/LoadingView"
import Toast, { toastTypes } from "../components/BaseComponents/Toast"
import {
  FormContainer,
  InputContainer,
  RequiredIcon,
  SubLabel,
  WarningMessage,
} from "../components/FormComponents"
// import { ControlSelect } from "../components/FormComponents/SelectWrapper"
import Layout from "../components/layout"
import TimezonePicker from "../components/TimezonePicker"
import useSiteMetadata from "../hooks/useSiteMetadata"
import useAPI from "../hooks/useAPI"
import useFirebaseWrapper from "../hooks/useFirebaseWrapper"
import useValidateRegistration from "../hooks/useValidateRegistration"
import {
  common,
  Fa,
  timePickerHelpers,
  // reactSelectHelpers,
} from "../utils"

// -- CONSTANTS
// const talkFormatOptions = ["Traditional talk", "Flash talk"]

// -- COMPONENTS
const TopicHeading = ({ children }) => <b>{`${children} · `}</b>

TopicHeading.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

const LoadingSpinnerContainer = styled.div`
  text-align: center;
  color: ${p => p.theme.colors.secondary};

  margin: 1.56rem auto;
`

/**
 * resolveHandler - a resolve wrapper for fetch promise
 * @param {Object} res - a response
 * @param {('submit'|'update')} action
 * @param {Object} forwardProps
 * @param {Function} forwardProps.sendConfirmationEmail
 * @param {Object} forwardProps.dynamicToastControl
 * @param {Function} forwardProps.setIsSending
 */
const resolveHandler = (
  res,
  action,
  { sendConfirmationEmail, dynamicToastControl, setIsSending }
) => {
  if (res.ok) {
    // scroll to top
    common.scrollTo()

    if (action === "submit") {
      sendConfirmationEmail("submission")
        .then(res =>
          res.ok
            ? console.log("email is sent!")
            : Promise.reject("email is not sent!")
        )
        .catch(err => console.log(err))
    }

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
}

/**
 * rejectHandler - a reject wrapper for fetch promise
 * @param {*} err
 * @param {Object} forwardProps
 * @param {Object} forwardProps.dynamicToastControl
 * @param {Function} forwardProps.setIsSending
 */
const rejectHandler = (err, { dynamicToastControl, setIsSending }) => {
  console.log(err)

  dynamicToastControl.current.show(
    toastTypes.error,
    `Something went wrong with error ${err}, please contact us.`
  )
  // reset
  setIsSending(false)
}

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
  // api
  const {
    submitAbstract,
    getAbstract,
    updateAbstract,
    sendConfirmationEmail,
  } = useAPI()

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

  // get existing submission
  const [currentSubmission, setCurrentSubmission] = useState(null)
  const [isLoadingCurrentData, setIsLoadingCurrentData] = useState(true)

  useEffect(() => {
    if (prevUserData?.submission_id) {
      getAbstract({
        edition: "2021-4",
        submissionId: prevUserData.submission_id,
      })
        .then(res => res.json())
        .then(resJson => setCurrentSubmission(resJson.data))
        .catch(err => console.log("err", err))
        .finally(() => setIsLoadingCurrentData(false))
    }

    if (prevUserData && !prevUserData.submission_id) {
      setIsLoadingCurrentData(false)
    }
  }, [getAbstract, prevUserData])

  // set default values in each field
  useEffect(() => {
    if (currentSubmission && !isLoadingCurrentData) {
      setValue([
        // {
        //   talkFormatSelect: reactSelectHelpers.saveFormatToOptions(
        //     currentSubmission?.talk_format
        //   ),
        // },
        {
          availableDatetimePicker: timePickerHelpers.deserializeSelectedDatetime(
            currentSubmission?.available_dt
          ),
        },
        { coauthors: currentSubmission?.coauthors },
        { title: currentSubmission?.title },
        { abstract: currentSubmission?.abstract },
        { arxiv: currentSubmission?.arxiv },
      ])
    }
  }, [currentSubmission, isLoadingCurrentData, setValue])

  const onSubmit = useCallback(
    data => {
      // console.log('[submission] check render trigger in onSubmit')

      setIsSending(true)

      const {
        // talkFormatSelect,
        availableDatetimePicker,
        ...restData
      } = data

      const numberOfSlots = 5
      const pickNotEnoughAvailableTime =
        availableDatetimePicker.reduce((acc, cur) => acc.concat(cur.time), [])
          .length < numberOfSlots

      // if no datetime is selected, set form error and do not submit to the server
      if (
        Array.isArray(availableDatetimePicker) &&
        pickNotEnoughAvailableTime
      ) {
        setError(
          "availableDatetimePicker",
          "isRequired",
          `Available Presentation Time is required at least ${numberOfSlots} slots.`
        )
        setIsSending(false)
        return
      }

      const readyData = {
        fullname: prevUserData.fullname,
        email: prevUserData.email,
        institution: prevUserData.institution,
        // talk_format: reactSelectHelpers.optionsToSaveFormat(talkFormatSelect),
        available_dt: timePickerHelpers.serializeSelectedDatetime(
          availableDatetimePicker
        ),
        arxiv: prevUserData.arxiv,
        ...restData,
      }

      if (currentSubmission) {
        updateAbstract({
          edition: "2021-4",
          data: readyData,
          submissionId: prevUserData.submission_id,
        })
          .then(res =>
            resolveHandler(res, "update", {
              sendConfirmationEmail,
              dynamicToastControl,
              setIsSending,
            })
          )
          .catch(err =>
            rejectHandler(err, { dynamicToastControl, setIsSending })
          )
      } else {
        submitAbstract({ edition: "2021-4", data: readyData })
          .then(res =>
            resolveHandler(res, "submit", {
              sendConfirmationEmail,
              dynamicToastControl,
              setIsSending,
            })
          )
          .catch(err =>
            rejectHandler(err, { dynamicToastControl, setIsSending })
          )
      }
    },
    [
      currentSubmission,
      prevUserData,
      sendConfirmationEmail,
      setError,
      submitAbstract,
      updateAbstract,
    ]
  )

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
      <h2>Submission form</h2>
      <p>
        This is a demo page for submission. We use Airtable to store the submission
        since we find it easier for organizers to check the submissions
        or build a page for reviewers. We put submission instructions on
        <Link to="/instructions/how-to-submit"> how to submit page </Link>
        where attendees can find more information there.
      </p>
      <p>
        We only allow one submission per attendee. An additional submission will
        replace the former one. Attendees can come back to this page
        to edit their information.
      </p>
      {isExpired === true && (
        <p
          style={{ textAlign: "center", color: "#ee1133", fontWeight: "bold" }}
        >
          The submission is now closed (already pass the deadline on
          {` ${submissionDate})`}
        </p>
      )}
      {isLoadingCurrentData && (
        <LoadingSpinnerContainer>
          <Fa icon="sync" spin />
        </LoadingSpinnerContainer>
      )}
      {isExpired === false && isLoadingCurrentData === false && (
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
              <label>Coauthors</label>
              <SubLabel>
                Put your coauthor each separated with ; (e.g. First Last,
                Affiliation; First Last, Affiliation; ...)
              </SubLabel>
              <input
                type="text"
                placeholder="name1, affiliation1; name2, affiliation2; ..."
                name="coauthors"
                ref={register()}
              />
            </InputContainer>
            {/* <InputContainer>
              <label>
                Preferred talk format
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
            </InputContainer> */}
            <InputContainer>
              <label>
                Please provide a link to your preprint(s) related to your
                conference talk (posted on any server bioRxiv, medRxiv, arXiv,
                PsyArxiv, etc)
              </label>
              <SubLabel>
                If you want to include links to articles or preprints, please
                add the URLs here separated by ;. We are developing new
                mechanisms to connect NMC4 talks to corresponding preprints. If
                your article or preprint comes out after you submit, let us know
                by email and we will include it.
              </SubLabel>
              <input
                type="text"
                placeholder="url1; url2; ..."
                name="arxiv"
                ref={register()}
              />
            </InputContainer>
            <InputContainer>
              <label>Preferred Time Zone</label>
              <SubLabel>
                Please select timezone based on your location or preferred
                timezone. The form will be updated according to your chosen
                location.
              </SubLabel>
              <TimezonePicker />
            </InputContainer>
            <InputContainer>
              <label>
                Available Presentation Date-Time
                <RequiredIcon />
              </label>
              <SubLabel>
                Please select as many slots as you can. We can allocate
                presentation slots that are good for everyone.
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
                value={
                  isSending
                    ? "Submitting.."
                    : currentSubmission
                      ? "Update"
                      : "Submit"
                }
                disabled={isSending}
              />
            </ButtonsContainer>
          </form>
        </FormContainer>
      )}
    </Layout>
  )
}
