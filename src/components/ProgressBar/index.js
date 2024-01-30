import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 *
 * @param {object} param0 component props
 */
const ProgressBar = ({ progress, className }) => (
  <div className={classnames('progress-bar', className)}
    style={{ width: `${progress}%` }}>
  </div>
);

ProgressBar.propTypes = {
  /** Progress value in % */
  progress: PropTypes.number,
  /** ProgressBar className */
  className: PropTypes.string,
};

export default ProgressBar;
