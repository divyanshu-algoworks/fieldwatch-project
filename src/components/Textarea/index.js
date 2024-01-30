import React, { Component, createRef, forwardRef } from 'react';
import classnames from 'classnames';

/**
 * Textarea is component for textarea. It takes all textarea props and "invalid"
 * prop to add special className for textarea with failed validation.
 * @param {object} props component props
 */
const Textarea = ({invalid, ...inputProps}, ref) => {
  const className = classnames(inputProps.className, 'fw-textarea', {
    'fw-textarea--invalid': invalid,
  });

  return (
    <textarea {...inputProps} rows={inputProps.rows || 3} className={className} value={inputProps.value || ''} ref={ref} />
  )
}

export default forwardRef(Textarea);
