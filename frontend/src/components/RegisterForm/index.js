import PropTypes from "prop-types"
import React, { useEffect, useRef, useState } from "react"
import { Controller, ErrorMessage, useForm } from "react-hook-form"
import useAPI from "../../hooks/useAPI"
import useFirebaseWrapper from "../../hooks/useFirebaseWrapper"
import useTimezone from "../../hooks/useTimezone"
import AvailableTimePicker, {
  datesOptions,
  timeBoundary,
  timeOptions,
  timezoneParser,
} from "../../pages/abstract-submission/components/AvailableTimePicker"
import {
  common,
  confirmPromise,
  reactSelectHelpers,
  timePickerHelpers,
} from "../../utils"
import { ButtonsContainer, FormButton } from "../BaseComponents/Buttons"
import Toast, { toastTypes } from "../BaseComponents/Toast"
import {
  AsyncControlSelect,
  ControlSelect,
} from "../FormComponents/SelectWrapper"
import Layout from "../layout"
import {
  CheckboxContainer,
  FormContainer,
  InputContainer,
  RequiredIcon,
  InstructionText,
  SubLabel,
  UncontrolledCheckbox,
  WarningMessage,
} from "../FormComponents"
import MindMatchingModule from "../../modules/mind-matching"

// -- CONSTANTS
const originEnum = {
  register: "REGISTER",
  editProfile: "EDIT_PROFILE",
}

const academicStatusChoices = [
  "Graduate student",
  "Post-doc",
  "Professor",
  "Research staff",
  "Research assistant",
  "Industry/Research unit",
  "Undergraduate student",
  "Other",
]

const genderChoices = [
  "Male",
  "Female",
  "Non-Binary",
  "Gender non conforming",
  "Transgender male",
  "Transgender female",
  "Prefer not to say",
]

const defaultOptionalFields = {
  google_scholar: "",
  personal_page: "",
  collaboration_score: "0.5",
  computational_score: "0.5",
  meeting_platform: [],
  abstracts: [],
  coi: [],
  participate_mind_match: false,
  participate_grouped_mind: false,
}

const defaultOptionalCheckers = {
  google_scholar: "",
  personal_page: "",
  collaboration_score: "0.5",
  computational_score: "0.5",
  meetingPlatformSelect: [],
  // a bit hacky here as there is no way to have default text as none
  abstracts: [""],
  coiSelect: [],
}

// -- FUNCTIONS
// default values for available datetime
const defaultTime = ["9:00", "18:00"]
const defaultValues = timezone => {
  if (!timezone) {
    return []
  }

  return datesOptions.map(date => {
    const accTime = []

    timeOptions.forEach(time => {
      const thisTime = timezoneParser(`${date} ${time}`, timezone)
      const isBetweenDefault = thisTime.isBetween(
        timezoneParser(`${date} ${defaultTime[0]}`, timezone),
        timezoneParser(`${date} ${defaultTime[1]}`, timezone),
        undefined,
        "[]"
      )
      // also filter datetime to be during event active time
      const isBetweenActiveEvent = thisTime.isBetween(
        timeBoundary[0],
        timeBoundary[1],
        undefined,
        "[)"
      )

      if (isBetweenDefault && isBetweenActiveEvent) {
        accTime.push(timezoneParser(`${date} ${time}`, timezone).toISOString())
      }
    })

    return {
      date,
      time: accTime,
    }
  })
}

const RegisterForm = ({ prevUserData, origin }) => {
  // get user info
  const { currentUserInfo: user } = useFirebaseWrapper()
  // state
  const [isOptedOut, setIsOptedOut] = useState(undefined)
  const [isPublic, setIsPublic] = useState(false)
  // warning is true only when there is some data in the optional fields
  const [optOutWarning, setOptOutWarning] = useState(undefined)
  const [isSending, setIsSending] = useState(false)
  // timezone for available datetime picker
  const { timezone: t } = useTimezone()
  const [timezone, setTimezone] = useState(t)
  // ref
  const toastControl = useRef(null)
  // api
  const { register: registerAPI } = useAPI()

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    watch,
    getValues,
    setError,
  } = useForm()

  const watchOptIns = watch([
    "participate_mind_match",
    // 'participate_grouped_mind',
  ])

  // side effect to track opt-in checkbox
  useEffect(() => {
    // isOptedOut is determined by 2 checkboxes
    setIsOptedOut(Object.entries(watchOptIns).every(([_, v]) => v === false))

    const optionalFields = getValues({ nest: true })

    // check if any optional field is filled
    const someIsFilled = Object.entries(defaultOptionalCheckers).some(
      ([k, v]) => JSON.stringify(optionalFields[k]) !== JSON.stringify(v)
    )

    if (someIsFilled) {
      setOptOutWarning(true)
    } else {
      setOptOutWarning(false)
    }
  }, [getValues, watchOptIns])

  // TODO: this effect should be able to refactor entirely?
  // -- fill values with prev data, except abstracts and cois
  // -- for abstracts and cois, they will be set the size and trigger rerendering first
  useEffect(() => {
    let isSubscribed = true

    if (prevUserData && isSubscribed) {
      // check if any of the prev optional field has value, if found even one
      // do not disable optional fields
      Object.entries(prevUserData).some(([key, val]) => {
        // check only those optional fields
        if (Object.keys(defaultOptionalFields).includes(key)) {
          // in case of string
          if (!Array.isArray(val) && defaultOptionalFields[key] !== val) {
            setIsOptedOut(false)
            return true
          }
          // in case of array
          if (Array.isArray(val) && val.length > 0) {
            setIsOptedOut(false)
            return true
          }
        }

        return false
      })

      Object.entries(prevUserData).forEach(([key, val]) => {
        switch (key) {
          case "abstracts":
            // setNumberOfAbstract(val.length === 0 ? 1 : val.length)
            // console.log('abstract is set', val.length);
            break
          case "institution":
            setValue(
              "institutionSelect",
              reactSelectHelpers.saveFormatToOptions(val)
            )
            break
          case "gender_status":
            setValue(
              "genderStatusSelect",
              reactSelectHelpers.saveFormatToOptions(val)
            )
            break
          case "academic_status":
            setValue(
              "academicStatusSelect",
              reactSelectHelpers.saveFormatToOptions(val)
            )
            break
          case "meeting_platform":
            setValue(
              "meetingPlatformSelect",
              reactSelectHelpers.saveFormatToOptions(val)
            )
            break
          case "coi":
            setValue("coiSelect", reactSelectHelpers.saveFormatToOptions(val))
            break
          case "available_dt":
            setValue(
              "availableDatetimePicker",
              timePickerHelpers.deserializeSelectedDatetime(val)
            )
            break
          case "public":
            setValue("public", val)
            if (val) {
              setIsPublic(true)
            }
            break
          default:
            setValue(key, val)
            break
        }
      })
    }

    return () => {
      isSubscribed = false
    }
  }, [prevUserData, setValue])

  // watch for timezone change and update val accordingly
  // this side effect should not watch prevUserData.available_dt directly
  // as new user has prevUserData as undefined
  useEffect(() => {
    if (!prevUserData?.available_dt) {
      setValue("availableDatetimePicker", defaultValues(timezone))
    }
  }, [prevUserData, setValue, timezone])



  // -- onSubmit funtion
  const onSubmit = data => {
    // to label button
    setIsSending(true)

    // before submit we need to reshape value from react-select
    const {
      institutionSelect,
      genderStatusSelect,
      academicStatusSelect,
      meetingPlatformSelect,
      abstracts,
      coiSelect,
      availableDatetimePicker,
      ...rest
    } = data

    const numberOfSlots = 5
    const pickNotEnoughAvailableTime =
      availableDatetimePicker?.reduce((acc, cur) => acc.concat(cur.time), [])
        .length < numberOfSlots

    // if no datetime is selected, set form error and do not submit to the server
    if (
      Array.isArray(availableDatetimePicker) &&
      pickNotEnoughAvailableTime &&
      !isPublic
    ) {
      setError(
        "availableDatetimePicker",
        "isRequired",
        `Available Watching Time is required at least ${numberOfSlots} slots.`
      )
      setIsSending(false)

      // scroll up to let user know what went wrong
      common.scrollBy(-500)
      return
    }

    const preparedPayload = {
      ...rest,
      gender_status: reactSelectHelpers.optionsToSaveFormat(genderStatusSelect),
      institution: !isPublic
        ? reactSelectHelpers.optionsToSaveFormat(institutionSelect)
        : "",
      academic_status: !isPublic
        ? reactSelectHelpers.optionsToSaveFormat(academicStatusSelect)
        : "",
      meeting_platform: !isPublic
        ? reactSelectHelpers.optionsToSaveFormat(meetingPlatformSelect)
        : [],
      abstracts: !isPublic
        ? abstracts.every(x => x === "")
          ? []
          : abstracts
        : [],
      coi: !isPublic ? reactSelectHelpers.optionsToSaveFormat(coiSelect) : [],
      available_dt: !isPublic
        ? timePickerHelpers.serializeSelectedDatetime(availableDatetimePicker)
        : "",
    }

    const readyData = {
      id: user.uid,
      payload: !isOptedOut
        ? preparedPayload
        : {
            ...preparedPayload,
            ...defaultOptionalFields,
          },
    }

    // console.log('readyData:', readyData);

    registerAPI(readyData)
      .then(() => {
        // console.log('data is submitted!', x);
        // scroll to top
        common.scrollTo()
        // show toast
        toastControl.current.show()
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        // reset
        setIsSending(false)
      })
  }

  return (
    <Layout>
      <Toast
        message="Your profile has been updated."
        type={toastTypes.success}
        ref={toastControl}
      />
      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputContainer>
            <label>
              First name
              <RequiredIcon />
            </label>
            <input
              type="text"
              placeholder="First name"
              name="firstname"
              ref={register({
                required: "First name is required.",
                maxLength: 50,
              })}
            />
            <ErrorMessage
              errors={errors}
              name="firstname"
              as={<WarningMessage />}
            />
          </InputContainer>
          <InputContainer>
            <label>
              Last name (and preferred pronouns)
              <RequiredIcon />
            </label>
            <input
              type="text"
              placeholder="Last name"
              name="lastname"
              ref={register({
                required: "Last name is required.",
                maxLength: 50,
              })}
            />
            <ErrorMessage
              errors={errors}
              name="lastname"
              as={<WarningMessage />}
            />
          </InputContainer>
          <InputContainer>
            <label>
              Email
              <RequiredIcon />
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              ref={register({
                required: "Email is required.",
              })}
            />
            <ErrorMessage
              errors={errors}
              name="email"
              as={<WarningMessage />}
            />
          </InputContainer>
          <InputContainer>
            <label>
              Gender
              <RequiredIcon />
            </label>
            <ControlSelect
              name="genderStatusSelect"
              control={control}
              isRequired="Gender status is required."
              options={genderChoices.map(k => ({
                value: k,
                label: k,
              }))}
            />
            <ErrorMessage
              errors={errors}
              name="genderStatusSelect"
              as={<WarningMessage />}
            />
          </InputContainer>
          <hr css="margin: 18px 0;" />
          <InstructionText>
            If you are not a neuroscientist, please check the box below
            <br />
            <SubLabel css="font-weight: normal;">
              The conference is open to all, not just neuroscientists. You do
              not have to fill out the forms below if you are not a
              neuroscientist. If you misclick this box, do not save your
              profile, just refresh this page.
            </SubLabel>
          </InstructionText>
          <CheckboxContainer>
            <UncontrolledCheckbox
              name="public"
              register={register()}
              onChangeCallback={checked => {
                if (checked) {
                  confirmPromise(
                    "Your pre-filled values below will be gone. Are you sure you do not wish to register as a scientist?"
                  )
                    .then(() => setIsPublic(checked))
                    .catch(() => setValue("public", false))
                } else {
                  setIsPublic(checked)
                }
              }}
            />
            <label>I am not a neuroscientist</label>
          </CheckboxContainer>
          <hr css="margin: 8px 0;" />
          {isPublic ? null : (
            <>
              <InputContainer>
                <label>
                  Institution
                  <RequiredIcon />
                </label>
                <AsyncControlSelect
                  name="institutionSelect"
                  control={control}
                  fetchUrl="/api/query_affiliation?n_results=10&q="
                  placeholder="Type to see options..."
                  isRequired="Institution is required."
                />
                <ErrorMessage
                  errors={errors}
                  name="institutionSelect"
                  as={<WarningMessage />}
                />
              </InputContainer>
              <InputContainer>
                <label>
                  Academic status
                  <RequiredIcon />
                </label>
                <ControlSelect
                  name="academicStatusSelect"
                  control={control}
                  isRequired="Academic status is required."
                  options={academicStatusChoices.map(k => ({
                    value: k,
                    label: k,
                  }))}
                />
                <ErrorMessage
                  errors={errors}
                  name="academicStatusSelect"
                  as={<WarningMessage />}
                />
              </InputContainer>
              <InputContainer>
                <label>
                  Available Watching Time
                  <RequiredIcon />
                </label>
                <SubLabel>
                  Please tell us below time slots that work best for you to
                  watch talks. We will use it to optimize schedule that best fit
                  for everyone.
                </SubLabel>
                <Controller
                  name="availableDatetimePicker"
                  as={
                    <AvailableTimePicker
                      onTimezoneChange={tz => setTimezone(tz)}
                    />
                  }
                  control={control}
                  rules={{
                    required: "Available Watching Time is required.",
                  }}
                />
                <ErrorMessage
                  errors={errors}
                  name="availableDatetimePicker"
                  as={<WarningMessage />}
                />
              </InputContainer>
              <hr />
              <MindMatchingModule
                abstracts={prevUserData?.abstracts}
                formControl={{ register, control, setValue, errors }}
                isOptedOut={isOptedOut}
                optOutWarning={optOutWarning}
              />
            </>
          )}
          <ButtonsContainer>
            <FormButton
              as="input"
              value={
                isSending
                  ? "Sending.."
                  : origin === originEnum.editProfile
                  ? "Save"
                  : "Submit"
              }
              // disabled={isSending}
              disabled
            />
          </ButtonsContainer>
        </form>
      </FormContainer>
    </Layout>
  )
}

RegisterForm.propTypes = {
  prevUserData: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    institution: PropTypes.string,
    gender_status: PropTypes.string,
    academic_status: PropTypes.string,
    google_scholar: PropTypes.string,
    personal_page: PropTypes.string,
    meeting_platform: PropTypes.arrayOf(PropTypes.string),
    abstracts: PropTypes.arrayOf(PropTypes.string),
    coi: PropTypes.arrayOf(PropTypes.string),
    collaboration_score: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    computational_score: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    participate_mind_match: PropTypes.bool,
    participate_grouped_mind: PropTypes.bool,
    available_dt: PropTypes.string,
  }),
  origin: PropTypes.string.isRequired,
}

RegisterForm.defaultProps = {
  prevUserData: undefined,
}

export { originEnum }
export default RegisterForm
