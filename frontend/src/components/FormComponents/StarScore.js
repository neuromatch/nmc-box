import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import Fa from '../../utils/fontawesome';

const Container = styled.div`
  display: flex;
  /* height = font-size + margin top/bottom = 25 + 10 + 10 */
  height: 45px;
  /* additional margin bottom */
  margin-bottom: 15px;
`;

const StyledLabel = styled.label`
  display: block;
  position: relative;
  font-size: 25px;
  padding-left: 30px;
  margin: 10px 0;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const StyledRadio = styled.input.attrs(() => ({
  type: 'radio',
}))`
  /* move radio button to be underneath a star */
  position: absolute;
  top: 0;
  left: 0;
  /* hide default radio */
  opacity: 0;
  cursor: pointer;
`;

const StyledStar = styled(Fa).attrs(() => ({
  icon: 'star',
}))`
  position: absolute;
  top: 0;
  left: 0;
  color: ${(props) => (props.checked ? 'orange' : props.hovered ? 'rgba(255, 165, 0, 0.5)' : '#eee')};
`;

const StarRadio = ({
  // eslint-disable-next-line react/prop-types
  name, value, register, selected, onChange, hovered, onHover,
}) => (
  <StyledLabel>
    <StyledRadio name={name} value={value} ref={register} onChange={() => onChange(value)} />
    <StyledStar
      onMouseEnter={() => onHover(value)}
      onMouseLeave={() => onHover(null)}
      // https://github.com/styled-components/styled-components/issues/1198#issuecomment-336621217
      // @ts-ignore
      checked={selected >= value ? 1 : 0}
      hovered={hovered >= value ? 1 : 0}
    />
  </StyledLabel>
);

// a function to create array of length
function createArrayWithNumbers(length) {
  return Array.from({ length }, (_, k) => k + 1);
}

const StarScore = ({ name, maxScore, register }) => {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const scores = createArrayWithNumbers(maxScore);

  return (
    <Container>
      {scores.map((score) => (
        <StarRadio
          key={score}
          name={name}
          value={score}
          register={register}
          selected={selected}
          onChange={setSelected}
          hovered={hovered}
          onHover={setHovered}
        />
      ))}
    </Container>
  );
};

StarScore.propTypes = {
  name: PropTypes.string.isRequired,
  maxScore: PropTypes.number,
  register: PropTypes.func.isRequired,
};

StarScore.defaultProps = {
  maxScore: 5,
};

export default StarScore;
