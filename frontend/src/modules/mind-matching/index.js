import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { ErrorMessage } from "react-hook-form"
import {
  AsyncControlSelect,
  CheckboxContainer,
  ControlSelect,
  DisabledToggler,
  InputContainer,
  InputRange,
  InstructionText,
  LabelContainer,
  SubLabel,
  UncontrolledCheckbox,
  WarningMessage,
} from "../../components/FormComponents"
import {
  AbstractButton,
  FieldArrayContainer,
  FieldArrayItem,
  RangeLabel,
} from "./components"

// -- CONSTANTS
const meetingPlatformChoices = [
  "Zoom.us",
  "Hangouts",
  "Skype",
  "Messenger",
  "Go To Meeting",
]

// -- FUNCTIONS
const createArrayWithNumbers = length => Array.from({ length }, (_, k) => k + 1)

// -- MAIN
const MindMatchingModule = ({
  abstracts,
  formControl: { register, control, setValue, errors },
  isOptedOut,
  optOutWarning,
}) => {
  const [numberOfAbstract, setNumberOfAbstract] = useState(1)

  // set abstracts and cois when they are rerendered
  useEffect(() => {
    if (abstracts) {
      abstracts.forEach((x, ind) => {
        setValue(`abstracts[${ind}]`, x)
      })
    }
  }, [abstracts, setValue, numberOfAbstract])

  return (
    <>
      <InstructionText>
        Check the box below if you want to participate in mind-matching part of
        the conference
        <br />
        <SubLabel css="font-weight: normal;">
          We will match you with 6 other partners with similar research interest
          to e-meet them during the conference.
        </SubLabel>
      </InstructionText>
      <CheckboxContainer>
        <UncontrolledCheckbox
          name="participate_mind_match"
          register={register()}
        />
        <label>I want to participate in the matching part of neuromatch</label>
      </CheckboxContainer>
      {isOptedOut === true && optOutWarning === true ? (
        <div>
          <WarningMessage>
            Your data below will be removed if you opt-out of the matching.
          </WarningMessage>
        </div>
      ) : null}
      {/* <CheckboxContainer>
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
      </CheckboxContainer> */}
      <DisabledToggler disabled={isOptedOut}>
        <InputContainer>
          <label>Google scholar URL</label>
          <input
            type="url"
            placeholder="Google Scholar URL"
            name="google_scholar"
            disabled={isOptedOut}
            ref={register()}
          />
        </InputContainer>
        <InputContainer>
          <label>Personal page</label>
          <input
            type="url"
            placeholder="Personal page"
            name="personal_page"
            disabled={isOptedOut}
            ref={register()}
          />
        </InputContainer>
        <InputContainer>
          <label>Preferred meeting style</label>
          {/* TODO: add label on both ends */}
          {/* casual meeting vs find collaboration */}
          <RangeLabel>
            <span>casual meeting</span>
            <span>find collaboration</span>
          </RangeLabel>
          <InputRange
            min="0"
            max="1"
            step="0.1"
            placeholder="Preferred meeting style"
            name="collaboration_score"
            disabled={isOptedOut}
            ref={register()}
          />
        </InputContainer>
        <InputContainer>
          <label>How experimental/computational you are?</label>
          {/* TODO: add label on both ends */}
          {/* experimental vs computational */}
          <RangeLabel>
            <span>experimental</span>
            <span>computational</span>
          </RangeLabel>
          <InputRange
            min="0"
            max="1"
            step="0.1"
            placeholder="How experimental/computational you are?"
            name="computational_score"
            disabled={isOptedOut}
            ref={register()}
          />
        </InputContainer>
        <InputContainer>
          <label>Preferred meeting platform</label>
          <ControlSelect
            name="meetingPlatformSelect"
            control={control}
            isMulti
            options={meetingPlatformChoices.map(k => ({
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
        </InputContainer>
        <InputContainer>
          <InstructionText>
            Put your abstracts or working abstracts below. The content of your
            abstract will exclusively be used to match you with people with
            similar content.
          </InstructionText>
          <LabelContainer>
            <label>Abstract</label>
            <AbstractButton
              onClick={() => setNumberOfAbstract(numberOfAbstract + 1)}
              disabled={isOptedOut}
              action="add"
            />
          </LabelContainer>
          <FieldArrayContainer>
            {createArrayWithNumbers(numberOfAbstract).map((count, ind) =>
              ind === 0 ? (
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
              )
            )}
          </FieldArrayContainer>
          <ErrorMessage
            errors={errors}
            name="abstracts[0]"
            as={<WarningMessage />}
          />
        </InputContainer>
        <InputContainer>
          <InstructionText>
            List all people who you think that you already know them well before
            the un-conference. We will try best not to match you with person you
            already know.
          </InstructionText>
          <SubLabel>
            Please separate each name with ;
          </SubLabel>
          <input
            type="text"
            placeholder="name1, affiliation1; name2, affiliation2; ..."
            name="coi"
            ref={register()}
            disabled={isOptedOut}
          />
        </InputContainer>
      </DisabledToggler>
    </>
  )
}

MindMatchingModule.propTypes = {
  abstracts: PropTypes.arrayOf(PropTypes.string),
  formControl: PropTypes.shape({
    register: PropTypes.func,
    control: PropTypes.object,
    setValue: PropTypes.func,
    errors: PropTypes.object,
  }).isRequired,
  isOptedOut: PropTypes.bool.isRequired,
  optOutWarning: PropTypes.bool.isRequired,
}

MindMatchingModule.defaultProps = {
  abstracts: null,
}

export default MindMatchingModule
