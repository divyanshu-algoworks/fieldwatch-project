import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TabState = ({ className, title, value, size, callback }) => (
  <div onClick={() => callback && callback()} className={classnames('tab-state', className, { [`tab-state--${size}`]: !!size })}>
    <div className={classnames("tab-state__title", { [`tab-state__title--${size}`]: !!size })}>{title}</div>
    <div className={classnames("tab-state__value", { [`tab-state__value--${size}`]: !!size })}>{value}</div>
  </div>
);

TabState.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.any,
};

export default TabState;

