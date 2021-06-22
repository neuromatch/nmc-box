import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Fa from '../../utils/fontawesome';

const StyledSpan = styled(Fa).attrs(() => ({
  icon: 'check-square',
}))`
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  /* important is needed here because
  https://github.com/FortAwesome/react-fontawesome/issues/134#issuecomment-471940596
   */
  font-size: 25px !important;
  color: #eee;
  /* &:after {
    content: "";
    position: absolute;
    display: none;
  } */
`;

const Wrapper = styled.label`
  display: block;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  & + label {
    padding-left: 30px;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  &:hover input ~ ${StyledSpan} {
    color: #ccc;
  }

  & input:checked ~ ${StyledSpan} {
    color: #2196f3;
  }
`;

const ControlledCheckbox = ({
  name, defaultValue, onChangeCallback, register,
}) => {
  const [isChecked, setIsChecked] = useState(defaultValue);

  useEffect(() => {
    setIsChecked(defaultValue);
  }, [defaultValue]);

  return (
    <Wrapper>
      <input
        name={name}
        type="checkbox"
        onChange={() => {
          setIsChecked(!isChecked);
          onChangeCallback(!isChecked);
        }}
        checked={isChecked}
        ref={register}
      />
      <StyledSpan />
    </Wrapper>
  );
};

ControlledCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
  onChangeCallback: PropTypes.func,
  register: PropTypes.func,
};

ControlledCheckbox.defaultProps = {
  defaultValue: false,
  onChangeCallback: () => {},
  register: () => {},
};

const UncontrolledCheckbox = ({ name, register, onChangeCallback }) => (
  <Wrapper>
    <input
      name={name}
      type="checkbox"
      ref={register}
      onChange={(e) => onChangeCallback(e.target.checked)}
    />
    <StyledSpan />
  </Wrapper>
);

UncontrolledCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  onChangeCallback: PropTypes.func,
};

UncontrolledCheckbox.defaultProps = {
  onChangeCallback: () => {},
};

export { ControlledCheckbox, UncontrolledCheckbox };
