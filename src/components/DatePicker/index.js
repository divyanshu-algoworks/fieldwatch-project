import React from 'react';
import PropTypes from 'prop-types';
import Single from './Single';
import Range from './Range';
const DatePicker = ({ type, ...props }) => {
  if (type === 'range') {
    return (<Range {...props} />)
  }

  return (
    <Single {...props} />
  );
}

DatePicker.propTypes = {
  type: PropTypes.oneOf(['single', 'range'])
}

DatePicker.defaultProps = {
  type: 'single'
}

export default DatePicker;
