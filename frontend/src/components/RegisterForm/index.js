import debounce from "lodash/debounce"
import PropTypes from "prop-types"
import React, { useEffect, useRef, useState } from "react"
import { Controller, ErrorMessage, useForm } from "react-hook-form"
import useAPI from "../../hooks/useAPI"
import useEventTime from "../../hooks/useEventTime"
import useFirebaseWrapper from "../../hooks/useFirebaseWrapper"
import MindMatchingModule from "../../modules/mind-matching"
import {
  common,
  confirmPromise,
  reactSelectHelpers,
  timePickerHelpers,
} from "../../utils"
import AvailableTimePicker from "../AvailableTimePicker"
import { ButtonsContainer, FormButton } from "../BaseComponents/Buttons"
import Toast, { toastTypes } from "../BaseComponents/Toast"
import {
  AsyncControlSelect,
  CheckboxContainer,
  ControlSelect,
  FormContainer,
  InputContainer,
  InstructionText,
  RequiredIcon,
  SubLabel,
  UncontrolledCheckbox,
  WarningMessage,
} from "../FormComponents"
import Layout from "../layout"
import TimezonePicker from "../TimezonePicker"

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
  coi: "",
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
  coi: "",
}

const RegisterForm = ({ prevUserData, origin }) => {
  // get user info
  const { currentUserInfo: user } = useFirebaseWrapper()
  // state
  const [isOptedOut, setIsOptedOut] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  // warning is true only when there is some data in the optional fields
  const [optOutWarning, setOptOutWarning] = useState(false)
  const [isSending, setIsSending] = useState(false)
  // api
  const { register: registerAPI, getAffiliation } = useAPI()
  // timeBoundary
  const { defaultAvailableTime } = useEventTime()
  // ref
  const toastControl = useRef(null)

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

  useEffect(() => {
    let isActive = true

    if (prevUserData && isActive) {
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

      const selectFields = {
        institution: "institutionSelect",
        gender_status: "genderStatusSelect",
        academic_status: "academicStatusSelect",
        meeting_platform: "meetingPlatformSelect",
      }

      const datetimeFields = {
        available_dt: "availableDatetimePicker",
      }

      Object.entries(prevUserData).forEach(([key, val]) => {
        if (selectFields.hasOwnProperty(key)) {
          setValue(
            selectFields[key],
            reactSelectHelpers.saveFormatToOptions(val)
          )
          return
        }

        if (datetimeFields.hasOwnProperty(key)) {
          setValue(
            datetimeFields[key],
            timePickerHelpers.deserializeSelectedDatetime(val)
          )
          return
        }

        setValue(key, val)
      })
    }

    return () => {
      isActive = false
    }
  }, [prevUserData, setValue])

  // watch for timezone change and update val accordingly
  // this side effect should not watch prevUserData.available_dt directly
  // as new user has prevUserData as undefined
  useEffect(() => {
    if (!prevUserData?.available_dt) {
      setValue("availableDatetimePicker", defaultAvailableTime)
    }
  }, [defaultAvailableTime, prevUserData, setValue])

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

    console.log("readyData:", readyData)

    registerAPI(readyData)
      .then(res => {
        // console.log('data is submitted!', x);
        // scroll to top
        common.scrollTo()

        if (res.ok) {
          const message = originEnum.register
            ? "Your profile has been registered."
            : "Your profile has been updated."

          toastControl.current.show(toastTypes.success, message)
        } else {
          toastControl.current.show(
            toastTypes.error,
            `Error ${res.status}: ${res.statusText}. Please contact our staff.`
          )
        }
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
      <Toast ref={toastControl} />
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
                  isRequired="Institution is required."
                  selectProps={{
                    loadOptions: debounce((inputValue, callback) => {
                      getAffiliation(inputValue)
                        .then(res => res.json())
                        .then(resJson =>
                          callback(
                            resJson?.data?.map(x => ({ value: x, label: x })) ||
                              []
                          )
                        )
                    }, 300),
                    placeholder: "Type to see options...",
                    isClearable: true,
                  }}
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
                <label>Preferred Time Zone</label>
                <SubLabel>
                  We will save your preferred time zome in the cookies of this
                  site. You may change the time zone anytime later in agenda and
                  abstract-browser pages by clicking on the gear icon.
                </SubLabel>
                <TimezonePicker />
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
                  as={<AvailableTimePicker />}
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
              disabled={isSending}
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
    coi: PropTypes.string,
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
