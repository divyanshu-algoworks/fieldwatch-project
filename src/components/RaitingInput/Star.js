import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const star = ({ value, checked, hovered, onChange, onMouseEnter, onMouseLeave }) => (
  <label className={classnames('raiting-input__star', {
      'raiting-input__star--hovered': !!hovered,
      'raiting-input__star--checked': !hovered && checked,
    })}
    onMouseEnter={() => onMouseEnter(value)}
    onMouseLeave={onMouseLeave}>
    <input type="radio" className="raiting-input__input" value={value}
      checked={checked} onChange={onChange} />
    <span className={classnames('raiting-input__icon', {'raiting-input__icon--hover': !!checked || !!hovered})}></span>
    <b className={classnames('raiting-input__value', {'raiting-input__value--hover': !!checked || !!hovered})}>{value}</b>
  </label>
);

star.propTypes = {
  value: PropTypes.number,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export default star;
