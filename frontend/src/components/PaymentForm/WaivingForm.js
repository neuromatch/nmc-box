/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { CheckboxBlock, ControlledCheckbox } from '../FormComponents/StyledFormComponents';
import { LineButton } from '../BaseComponents/Buttons';
import useValidateRegistration from '../../hooks/useValidateRegistration';

const SubmitButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 15px;
`;

const WaivingForm = ({ onConfirmWaive, onCancel }) => {
  const [certified, setCertified] = useState(false);
  const { prevUserData } = useValidateRegistration();

  return (
    <div>
      {prevUserData?.public === true
        ? (
          <p>
            We want to make Neuromatch Conference accessible to all and
            sustainable. We collect a small fee from conference attendees
            if you can afford the fees. If you are not from a well-funded
            lab or company or are from an underrepresented group or attending
            as a member of the public, you can waive this fee.
          </p>
        )
        : (
          <p>
            We want to make Neuromatch Conference accessible to all and
            sustainable. We collect a small fee from conference attendees
            if you can afford the fees. If you are not from a well-funded
            lab or company or are from an underrepresented group, you can
            waive this fee.
          </p>
        )}
      <CheckboxBlock>
        <ControlledCheckbox
          name="waiveBox"
          onChangeCallback={(checked) => {
            setCertified(checked);
          }}
        />
        {prevUserData?.public === true
          ? (
            <label>
              I certify that I&apos;ve asked my advisor or supervisor that my lab
              or company  cannot pay for this conference fee, or am attending
              the conference as a member of the public.
            </label>
          )
          : (
            <label>
              I certify that
              I&apos;ve asked my advisor or supervisor that my lab orcompany
              cannot pay for this conference fee.
            </label>
          )}
      </CheckboxBlock>
      <SubmitButtonContainer>
        <LineButton
          color="#ff3333"
          hoverColor="#ff0000"
          hoverBgColor="#fff"
          onClick={onCancel}
        >
          Cancel
        </LineButton>
        <LineButton
          disabled={!certified}
          color="#00bb00"
          hoverColor="#33bb33"
          hoverBgColor="#fff"
          onClick={() => {
            // this close modal
            onConfirmWaive();
            // TODO: still need to handle waiving over the API
          }}
          // onClick={handleWaiving}
        >
          Apply for waiving
        </LineButton>
      </SubmitButtonContainer>
    </div>
  );
};

WaivingForm.propTypes = {
  onConfirmWaive: PropTypes.func,
  onCancel: PropTypes.func,
};

WaivingForm.defaultProps = {
  onConfirmWaive: () => {},
  onCancel: () => {},
};

export default WaivingForm;
