import React from 'react';
import PropTypes from 'prop-types';

const Col = ({ flex, children }) => (
  <div className="flex-grid__col" style={{ flex }}>{children}</div>
);

Col.propTypes = {
  flex: PropTypes.string
};

Col.defaultProps = {
  flex: '1 1 auto'
}

export default Col;
