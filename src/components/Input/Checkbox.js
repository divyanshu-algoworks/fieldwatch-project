import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
/**
 * Checkbox is component for render input with 'checkbox' type
  * @param {object} props component props
 */
const Checkbox = (props) => {
  const { id, onChange, className, label, disabled, size, name, readOnly } = props;
  const checked = props.checked === undefined ? props.value : props.checked;
  const popUpClass = className && className.includes('h-w-17p');
  return (
    <label className={classnames('fw-checkbox', `fw-checkbox--${size}`, {'wf-checkbox--disabled': disabled})}>
      <div className={classnames('fw-checkbox__indicator', `fw-checkbox__indicator--${size}`, {
        'fw-checkbox__indicator--checked': checked,
        'fw-checkbox__indicator--disabled': disabled,
        'disabled_element': false,
         'h-w-17p': popUpClass,
      })}></div>
      <i class="fa-regular fa-check"></i>
      <input type="checkbox" id={id} className={classnames('fw-checkbox__input', className)} checked={checked}
        disabled={disabled} name={name} readOnly={readOnly}
        onChange={onChange} />
      {!!label ? <div className={classnames('fw-checkbox__label-text', 'ellipsis', {'fw-checkbox__label-text--disabled': disabled, 'fs-12': popUpClass})}>{label}</div> : null}
    </label>
  );
}

Checkbox.propTypes = {
  /** Input id (for labels) */
  id: PropTypes.any,
  /** Handler for change input value */
  onChange: PropTypes.func,
  /** Is input checked or not */
  checked: PropTypes.bool,
  /** is checkbox disabled */
  disabled: PropTypes.bool,
  /** Checkbox input text */
  label: PropTypes.string,
  size: PropTypes.oneOf(['default', 'small']),
}

Checkbox.defaultProps = {
  size: 'default',
}

export default Checkbox;
