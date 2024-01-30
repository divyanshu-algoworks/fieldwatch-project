import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Radio is component for input with type "radio"
 * @param {object} props component props
 */
const Radio = (props) => {
  const { id, onChange, className, label, labelClassName, value, correct, invalid, inputClass, disabled } = props;
  const checked = props.checked === undefined ? value : props.checked;

  return (
    <label className={classnames(inputClass, {[`${inputClass}--disabled`]: !!disabled})}>
      <div className={classnames(`${inputClass}__indicator`, {
        [`${inputClass}__indicator--checked`]: checked,
        [`${inputClass}__indicator--correct`]: correct,
        [`${inputClass}__indicator--invalid`]: invalid,
      })}></div>
      <input type="radio" id={id} className={classnames(`${inputClass}__input`, className)} checked={checked}
        disabled={disabled}
        onChange={onChange} value={value} />
        {!!label ? <div className={classnames(`${inputClass}__label-text`, labelClassName, {[`${inputClass}__label-text--invalid`]: invalid})}>{label}</div> : null}
    </label>
  );
}

Radio.propTypes = {
  /** Input id for label */
  id: PropTypes.any,
  /** Change input value handler */
  onChange: PropTypes.func,
  /** className for input */
  className: PropTypes.string,
  /** Is current radio selected */
  checked: PropTypes.bool,
  /** Input label */
  label: PropTypes.any,
  /** className for label div */
  labelClassName: PropTypes.string,
  /** Input value */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

Radio.defaultProps = {
  inputClass: 'fw-radio'
}

export default Radio;
