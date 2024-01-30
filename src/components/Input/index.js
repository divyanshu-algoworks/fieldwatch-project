import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import DefaultInput from './DefaultInput';
import Checkbox from './Checkbox';
import Radio from './Radio';
import Search from './Search';
import File from './File';
import AutocompleteInput from './AutocompleteInput';

export default class Input extends Component {
  state = {
    focused: false
  }
  static propTypes = {
    invalid: PropTypes.bool
  };

  static defaultProps = {
    type: 'text'
  };

  @autobind handleFocus() {
   console.log('okk')
    this.setState({ focused: true });
  }

  @autobind handleBlur() {
    this.setState({ focused: false });
  }

  componentWillUnmount() {
    if (this.focusTimeout) {
      clearTimeout(this.focusTimeout);
      this.setState({ focused: false });
    }
  }

  render() {
    const {
      name,
      type,
      invalid,
      correct,
      label,
      timeout,
      autocomplete,
      autocompleteOptions,
      disabled,
      optionRenderer,
      onAutocompleteSelect,
      onAutocompleteStart,
      onAutocompleteEnd,
      pending,
      size,
      ...inputProps
    } = this.props;

    const { focused } = this.state;
    const className = classnames(this.props.className, 'fw-input', {
      'fw-input--invalid': invalid,
      'fw-input--focused': focused,
      'fw-input--disabled': disabled,
      [`fw-input-${type}`]: true,
      [`fw-input--${type}`]: true,
      [`fw-input-${type}--invalid`]: invalid
    });
    if (type === 'checkbox') {
      return (<Checkbox name={name} {...inputProps} className={className} label={label} size={size} disabled={disabled} />);
    }
    if (type === 'radio') {
      return (<Radio {...inputProps} name={name} invalid={invalid} correct={correct} className={className} disabled={disabled} label={label} />);
    }
    if (type === 'search') {
      return (<Search name={name} {...inputProps} className={className} timeout={timeout} disabled={disabled} />);
    }
    if (type === 'file') {
      return (<File name={name} {...inputProps} className={className} label={label} disabled={disabled} />);
    }

    if (!!autocomplete) {
      return (<AutocompleteInput name={name} ref={comp => {
        if (!!comp)
          this.input = comp.input
      }} type={type} pending={pending} {...inputProps} className={className} value={inputProps.value || ''} autocompleteOptions={autocompleteOptions} optionRenderer={optionRenderer} onAutocompleteSelect={onAutocompleteSelect} disabled={disabled} />);
    }

    return (<DefaultInput name={name} ref={comp => {
      if (!!comp)
        this.input = comp.input
    }} type={type} {...inputProps} className={className} value={inputProps.value || ''} disabled={disabled} />);
  }
}
