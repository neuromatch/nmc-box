import React from 'react';
import PropTypes from 'prop-types';

const SvgVerticalGradient = ({ bgColor, fillColor, fillPercent }) => {
  if (!fillPercent) {
    return null;
  }

  return (
    <svg width="0" height="0">
      <linearGradient id={`lgrad-${fillPercent}`} x1={`${fillPercent}%`} y1="100%" x2={`${fillPercent}%`} y2="0%">
        <stop offset={`${fillPercent}%`} stopColor={fillColor} stopOpacity="1" />
        <stop offset={`${fillPercent}%`} stopColor={bgColor} stopOpacity="1" />
      </linearGradient>
    </svg>
  );
};

SvgVerticalGradient.propTypes = {
  bgColor: PropTypes.string.isRequired,
  fillColor: PropTypes.string.isRequired,
  fillPercent: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

SvgVerticalGradient.defaultProps = {
  fillPercent: null,
};

export default SvgVerticalGradient;
