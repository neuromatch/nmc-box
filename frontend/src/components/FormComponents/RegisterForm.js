/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
// import { navigate } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import { Controller, ErrorMessage, useForm } from 'react-hook-form';
import useFirebaseWrapper from '../../hooks/useFirebaseWrapper';
import Layout from '../layout';
import {
  FieldArrayContainer,
  FieldArrayItem,
  FormWrapper,
  InputBlock,
  LabelBlock,
  RangeLabels,
  RequiredIcon,
  StyledInputRange,
  StyledInstructionText,
  WarningMessage,
  DisabledWrapper,
  CheckboxBlock,
  UncontrolledCheckbox,
  SubLabel,
  AbstractButton,
} from './StyledFormComponents';
import { AsyncControlSelect, ControlSelect } from './SelectWrapper';
import Toast, { toastTypes } from '../BaseComponents/Toast';
import {
  ButtonsContainer,
  FormButton,
} from '../BaseComponents/Buttons';
import {
  confirmPromise,
  timePickerHelpers,
  reactSelectHelpers,
  common,
} from '../../utils';
import AvailableTimePicker, {
  datesOptions,
  timeOptions,
  timezoneParser,
  timeBoundary,
} from '../../pages/abstract-submission/components/AvailableTimePicker';
import useTimezone from '../../hooks/useTimezone';
import useAPI from '../../hooks/useAPI';

// -- CONSTANTS
const originEnum = {
  register: 'REGISTER',
  editProfile: 'EDIT_PROFILE',
};

const academicStatusChoices = [
  'Graduate student',
  'Post-doc',
  'Professor',
  'Research staff',
  'Research assistant',
  'Industry/Research unit',
  'Undergraduate student',
  'Other',
];

const genderChoices = [
  'Male',
  'Female',
  'Non-Binary',
  'Gender non conforming',
  'Transgender male',
  'Transgender female',
  'Prefer not to say',
];

const meetingPlatformChoices = [
  'Zoom.us',
  'Hangouts',
  'Skype',
  'Messenger',
  'Go To Meeting',
];

const defaultOptionalFields = {
  google_scholar: '',
  personal_page: '',
  collaboration_score: '0.5',
  computational_score: '0.5',
  meeting_platform: [],
  abstracts: [],
  coi: [],
  participate_mind_match: false,
  participate_grouped_mind: false,
};

const defaultOptionalCheckers = {
  google_scholar: '',
  personal_page: '',
  collaboration_score: '0.5',
  computational_score: '0.5',
  meetingPlatformSelect: [],
  // a bit hacky here as there is no way to have default text as none
  abstracts: [''],
  coiSelect: [],
};

// -- FUNCTIONS
const createArrayWithNumbers = (length) => Array.from({ length }, (_, k) => k + 1);

// default values for available datetime
const defaultTime = ['9:00', '18:00'];
const defaultValues = (timezone) => {
  if (!timezone) {
    return [];
  }

  return datesOptions.map((date) => {
    const accTime = [];

    timeOptions.forEach((time) => {
      const thisTime = timezoneParser(`${date} ${time}`, timezone);
      const isBetweenDefault = thisTime.isBetween(
        timezoneParser(`${date} ${defaultTime[0]}`, timezone),
        timezoneParser(`${date} ${defaultTime[1]}`, timezone),
        undefined,
        '[]',
      );
      // also filter datetime to be during event active time
      const isBetweenActiveEvent = thisTime.isBetween(
        timeBoundary[0],
        timeBoundary[1],
        undefined,
        '[)',
      );

      if (isBetweenDefault && isBetweenActiveEvent) {
        accTime.push(timezoneParser(`${date} ${time}`, timezone).toISOString());
      }
    });

    return {
      date,
      time: accTime,
    };
  });
};

const RegisterForm = ({ prevUserData, origin }) => {
  // get user info
  const { currentUserInfo: user } = useFirebaseWrapper();
  // state
  const [numberOfAbstract, setNumberOfAbstract] = useState(1);
  const [isOptedOut, setIsOptedOut] = useState(undefined);
  const [isPublic, setIsPublic] = useState(false);
  // warning is true only when there is some data in the optional fields
  const [optOutWarning, setOptOutWarning] = useState(undefined);
  const [isSending, setIsSending] = useState(false);
  // timezone for available datetime picker
  const { timezone: t } = useTimezone();
  const [timezone, setTimezone] = useState(t);
  // ref
  const toastControl = useRef(null);
  // api
  const { register: registerAPI } = useAPI();

  const {
    register,
    handleSubmit,
    errors,
    setValue,
    control,
    watch,
    getValues,
    setError,
  } = useForm();

  const watchOptIns = watch([
    'participate_mind_match',
    // 'participate_grouped_mind',
  ]);

  // side effect to track opt-in checkbox
  useEffect(() => {
    // isOptedOut is determined by 2 checkboxes
    setIsOptedOut(Object.entries(watchOptIns).every(([_, v]) => v === false));

    const optionalFields = getValues({ nest: true });

    // check if any optional field is filled
    const someIsFilled = Object.entries(defaultOptionalCheckers).some(
      ([k, v]) => JSON.stringify(optionalFields[k]) !== JSON.stringify(v),
    );

    if (someIsFilled) {
      setOptOutWarning(true);
    } else {
      setOptOutWarning(false);
    }
  }, [getValues, watchOptIns]);

  // -- fill values with prev data, except abstracts and cois
  // -- for abstracts and cois, they will be set the size and trigger rerendering first
  useEffect(() => {
    let isSubscribed = true;

    if (prevUserData && isSubscribed) {
      // check if any of the prev optional field has value, if found even one
      // do not disable optional fields
      Object.entries(prevUserData).some(([key, val]) => {
        // check only those optional fields
        if (Object.keys(defaultOptionalFields).includes(key)) {
          // in case of string
          if (!Array.isArray(val) && defaultOptionalFields[key] !== val) {
            setIsOptedOut(false);
            return true;
          }
          // in case of array
          if (Array.isArray(val) && val.length > 0) {
            setIsOptedOut(false);
            return true;
          }
        }

        return false;
      });

      Object.entries(prevUserData).forEach(([key, val]) => {
        switch (key) {
          case 'abstracts':
            setNumberOfAbstract(val.length === 0 ? 1 : val.length);
            // console.log('abstract is set', val.length);
            break;
          case 'institution':
            setValue(
              'institutionSelect',
              reactSelectHelpers.saveFormatToOptions(val),
            );
            break;
          case 'gender_status':
            setValue(
              'genderStatusSelect',
              reactSelectHelpers.saveFormatToOptions(val),
            );
            break;
          case 'academic_status':
            setValue(
              'academicStatusSelect',
              reactSelectHelpers.saveFormatToOptions(val),
            );
            break;
          case 'meeting_platform':
            setValue(
              'meetingPlatformSelect',
              reactSelectHelpers.saveFormatToOptions(val),
            );
            break;
          case 'coi':
            setValue('coiSelect', reactSelectHelpers.saveFormatToOptions(val));
            break;
          case 'available_dt':
            setValue(
              'availableDatetimePicker',
              timePickerHelpers.deserializeSelectedDatetime(val),
            );
            break;
          case 'public':
            setValue(
              'public',
              val,
            );
            if (val) {
              setIsPublic(true);
            }
            break;
          default:
            setValue(key, val);
            break;
        }
      });
    }

    return () => {
      isSubscribed = false;
    };
  }, [prevUserData, setValue]);

  // watch for timezone change and update val accordingly
  // this side effect should not watch prevUserData.available_dt directly
  // as new user has prevUserData as undefined
  useEffect(() => {
    if (!prevUserData?.available_dt) {
      setValue(
        'availableDatetimePicker',
        defaultValues(timezone),
      );
    }
  }, [prevUserData, setValue, timezone]);

  // set abstracts and cois when they are rerendered
  useEffect(() => {
    if (prevUserData) {
      prevUserData.abstracts.forEach((x, ind) => {
        setValue(`abstracts[${ind}]`, x);
      });
    }
  }, [prevUserData, setValue, numberOfAbstract]);

  // -- onSubmit funtion
  const onSubmit = (data) => {
    // to label button
    setIsSending(true);

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
    } = data;

    const numberOfSlots = 5;
    const pickNotEnoughAvailableTime = availableDatetimePicker
      ?.reduce((acc, cur) => acc.concat(cur.time), []).length < numberOfSlots;

    // if no datetime is selected, set form error and do not submit to the server
    if (
      Array.isArray(availableDatetimePicker)
      && pickNotEnoughAvailableTime
      && !isPublic
    ) {
      setError(
        'availableDatetimePicker',
        'isRequired',
        `Available Watching Time is required at least ${numberOfSlots} slots.`,
      );
      setIsSending(false);

      // scroll up to let user know what went wrong
      common.scrollBy(-500);
      return;
    }

    const preparedPayload = {
      ...rest,
      gender_status: reactSelectHelpers.optionsToSaveFormat(genderStatusSelect),
      institution: !isPublic
        ? reactSelectHelpers.optionsToSaveFormat(institutionSelect)
        : '',
      academic_status: !isPublic
        ? reactSelectHelpers.optionsToSaveFormat(
          academicStatusSelect,
        )
        : '',
      meeting_platform: !isPublic
        ? reactSelectHelpers.optionsToSaveFormat(
          meetingPlatformSelect,
        )
        : [],
      abstracts: !isPublic
        ? abstracts.every((x) => x === '') ? [] : abstracts
        : [],
      coi: !isPublic
        ? reactSelectHelpers.optionsToSaveFormat(coiSelect)
        : [],
      available_dt: !isPublic
        ? timePickerHelpers.serializeSelectedDatetime(availableDatetimePicker)
        : '',
    };

    const readyData = {
      id: user.uid,
      payload: !isOptedOut
        ? preparedPayload
        : {
          ...preparedPayload,
          ...defaultOptionalFields,
        },
    };

    // console.log('readyData:', readyData);

    registerAPI(readyData)
      .then(() => {
        // console.log('data is submitted!', x);
        // scroll to top
        common.scrollTo();
        // show toast
        toastControl.current.show();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        // reset
        setIsSending(false);
      });
  };

  return (
    <Layout>
      <Toast
        message="Your profile has been updated."
        type={toastTypes.success}
        ref={toastControl}
      />
      <FormWrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputBlock>
            <label>
              First name
              <RequiredIcon />
            </label>
            <input
              type="text"
              placeholder="First name"
              name="firstname"
              ref={register({
                required: 'First name is required.',
                maxLength: 50,
              })}
            />
            <ErrorMessage
              errors={errors}
              name="firstname"
              as={<WarningMessage />}
            />
          </InputBlock>
          <InputBlock>
            <label>
              Last name (and preferred pronouns)
              <RequiredIcon />
            </label>
            <input
              type="text"
              placeholder="Last name"
              name="lastname"
              ref={register({
                required: 'Last name is required.',
                maxLength: 50,
              })}
            />
            <ErrorMessage
              errors={errors}
              name="lastname"
              as={<WarningMessage />}
            />
          </InputBlock>
          <InputBlock>
            <label>
              Email
              <RequiredIcon />
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              ref={register({
                required: 'Email is required.',
              })}
            />
            <ErrorMessage
              errors={errors}
              name="email"
              as={<WarningMessage />}
            />
          </InputBlock>
          <InputBlock>
            <label>
              Gender
              <RequiredIcon />
            </label>
            <ControlSelect
              name="genderStatusSelect"
              control={control}
              isRequired="Gender status is required."
              options={genderChoices.map((k) => ({
                value: k,
                label: k,
              }))}
            />
            <ErrorMessage
              errors={errors}
              name="genderStatusSelect"
              as={<WarningMessage />}
            />
          </InputBlock>
          <hr css="margin: 18px 0;" />
          <StyledInstructionText>
            If you are not a neuroscientist, please check the box below
            <br />
            <SubLabel css="font-weight: normal;">
              The conference is open to all, not just neuroscientists.
              You do not have to fill out the forms below if you are
              not a neuroscientist. If you misclick this box, do not save
              your profile, just refresh this page.
            </SubLabel>
          </StyledInstructionText>
          <CheckboxBlock>
            <UncontrolledCheckbox
              name="public"
              register={register()}
              onChangeCallback={(checked) => {
                if (checked) {
                  confirmPromise('Your pre-filled values below will be gone. Are you sure you do not wish to register as a scientist?')
                    .then(() => setIsPublic(checked))
                    .catch(() => setValue('public', false));
                } else {
                  setIsPublic(checked);
                }
              }}
            />
            <label>
              I am not a neuroscientist
            </label>
          </CheckboxBlock>
          <hr css="margin: 8px 0;" />
          {isPublic
            ? null
            : (
              <>
                <InputBlock>
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
                </InputBlock>
                <InputBlock>
                  <label>
                    Academic status
                    <RequiredIcon />
                  </label>
                  <ControlSelect
                    name="academicStatusSelect"
                    control={control}
                    isRequired="Academic status is required."
                    options={academicStatusChoices.map((k) => ({
                      value: k,
                      label: k,
                    }))}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="academicStatusSelect"
                    as={<WarningMessage />}
                  />
                </InputBlock>
                <InputBlock>
                  <label>
                    Available Watching Time
                    <RequiredIcon />
                  </label>
                  <SubLabel>
                    Please tell us below time slots that work best for you to watch
                    talks. We will use it to optimize schedule that best fit for
                    everyone.
                  </SubLabel>
                  <Controller
                    name="availableDatetimePicker"
                    as={(
                      <AvailableTimePicker
                        onTimezoneChange={(tz) => setTimezone(tz)}
                      />
                    )}
                    control={control}
                    rules={{
                      required: 'Available Watching Time is required.',
                    }}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="availableDatetimePicker"
                    as={<WarningMessage />}
                  />
                </InputBlock>
                <hr />
                <StyledInstructionText>
                  Check the box below if you want to participate in mind-matching part
                  of the conference
                  <br />
                  <SubLabel css="font-weight: normal;">
                    We will match you with 6 other partners with similar research
                    interest to e-meet them during the conference.
                  </SubLabel>
                </StyledInstructionText>
                <CheckboxBlock>
                  <UncontrolledCheckbox
                    name="participate_mind_match"
                    register={register()}
                  />
                  <label>
                    I want to participate in the matching part of neuromatch
                  </label>
                </CheckboxBlock>
                {isOptedOut === true && optOutWarning === true ? (
                  <div>
                    <WarningMessage>
                      Your data below will be removed if you opt-out of the matching.
                    </WarningMessage>
                  </div>
                ) : null}
                {/* <CheckboxBlock>
                  <UncontrolledCheckbox
                    name="participate_grouped_mind"
                    register={register()}
                  />
                  <label>
                    I want to participate in the “grouped mind” part of neuromatch (see
                    {' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href="/instructions#grouped-mind-instructions"
                    >
                      instructions
                    </a>
                    )
                  </label>
                  {
                    isOptedOut === true && optOutWarning === true
                      ? (
                        <div>
                          <WarningMessage>
                            Your data below will be removed if you opt-out of the matching.
                          </WarningMessage>
                        </div>
                      )
                      : null
                  }
                </CheckboxBlock> */}
                <DisabledWrapper disabled={isOptedOut}>
                  <InputBlock>
                    <label>Google scholar URL</label>
                    <input
                      type="url"
                      placeholder="Google Scholar URL"
                      name="google_scholar"
                      disabled={isOptedOut}
                      ref={register()}
                    />
                  </InputBlock>
                  <InputBlock>
                    <label>Personal page</label>
                    <input
                      type="url"
                      placeholder="Personal page"
                      name="personal_page"
                      disabled={isOptedOut}
                      ref={register()}
                    />
                  </InputBlock>
                  <InputBlock>
                    <label>Preferred meeting style</label>
                    {/* TODO: add label on both ends */}
                    {/* casual meeting vs find collaboration */}
                    <RangeLabels>
                      <span>casual meeting</span>
                      <span>find collaboration</span>
                    </RangeLabels>
                    <StyledInputRange
                      min="0"
                      max="1"
                      step="0.1"
                      placeholder="Preferred meeting style"
                      name="collaboration_score"
                      disabled={isOptedOut}
                      ref={register()}
                    />
                  </InputBlock>
                  <InputBlock>
                    <label>How experimental/computational you are?</label>
                    {/* TODO: add label on both ends */}
                    {/* experimental vs computational */}
                    <RangeLabels>
                      <span>experimental</span>
                      <span>computational</span>
                    </RangeLabels>
                    <StyledInputRange
                      min="0"
                      max="1"
                      step="0.1"
                      placeholder="How experimental/computational you are?"
                      name="computational_score"
                      disabled={isOptedOut}
                      ref={register()}
                    />
                  </InputBlock>
                  <InputBlock>
                    <label>Preferred meeting platform</label>
                    <ControlSelect
                      name="meetingPlatformSelect"
                      control={control}
                      isMulti
                      options={meetingPlatformChoices.map((k) => ({
                        value: k,
                        label: k,
                      }))}
                      disabled={isOptedOut}
                    />
                    <ErrorMessage
                      errors={errors}
                      name="meetingPlatformSelect"
                      as={<WarningMessage />}
                    />
                  </InputBlock>
                  <InputBlock>
                    <StyledInstructionText>
                      Put your abstracts or working abstracts below. The content of
                      your abstract will exclusively be used to match you with people
                      with similar content.
                    </StyledInstructionText>
                    <LabelBlock>
                      <label>Abstract</label>
                      <AbstractButton
                        onClick={() => setNumberOfAbstract(numberOfAbstract + 1)}
                        disabled={isOptedOut}
                        action="add"
                      />
                    </LabelBlock>
                    <FieldArrayContainer>
                      {createArrayWithNumbers(numberOfAbstract).map((count, ind) => (ind === 0 ? (
                        <FieldArrayItem key={`abstract-${count}`}>
                          <textarea
                            name={`abstracts[${ind}]`}
                            placeholder={`Abstract ${count}`}
                            rows="4"
                            disabled={isOptedOut}
                            ref={register()}
                          />
                        </FieldArrayItem>
                      ) : (
                        <FieldArrayItem key={`abstract-${count}`}>
                          <textarea
                            name={`abstracts[${ind}]`}
                            placeholder={`Abstract ${count}`}
                            rows="4"
                            disabled={isOptedOut}
                            ref={register()}
                          />
                          <AbstractButton
                            onClick={() => setNumberOfAbstract(numberOfAbstract - 1)}
                            action="remove"
                          />
                        </FieldArrayItem>
                      )))}
                    </FieldArrayContainer>
                    <ErrorMessage
                      errors={errors}
                      name="abstracts[0]"
                      as={<WarningMessage />}
                    />
                  </InputBlock>
                  <InputBlock>
                    <StyledInstructionText>
                      List all people who you think that you already know them well
                      before the un-conference. We will try best not to match you with
                      person you already know.
                    </StyledInstructionText>
                    <LabelBlock>
                      <label>
                        People I know:
                      </label>
                    </LabelBlock>
                    <AsyncControlSelect
                      name="coiSelect"
                      control={control}
                      fetchUrl="/api/query_name?n_results=10&q="
                      isMulti
                      placeholder="Type to see options..."
                      menuPlacement="top"
                      disabled={isOptedOut}
                    />
                  </InputBlock>
                </DisabledWrapper>
              </>
            )}
          <ButtonsContainer>
            <FormButton
              as="input"
              value={
                isSending
                  ? 'Sending..'
                  : origin === originEnum.editProfile
                    ? 'Save'
                    : 'Submit'
              }
              // disabled={isSending}
              disabled
            />
          </ButtonsContainer>
        </form>
      </FormWrapper>
    </Layout>
  );
};

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
};

RegisterForm.defaultProps = {
  prevUserData: undefined,
};

export { originEnum };
export default RegisterForm;
