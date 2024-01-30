import React from 'react';
import PropTypes from 'prop-types';
const Row = ({ flexDirection, children }) => (
  <div className="flex-grid__row" style={flexDirection}>
    {children}
  </div>
);

export default Row;
