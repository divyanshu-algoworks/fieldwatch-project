import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';
import DatePicker from '../../components/DatePicker';
import Tooltip from '../../components/Tooltip';

/**
 * FormGroup is component, which return input with label for FieldWatch forms
 * To set type of input (like checkbox, select, datepicker, or other) you should
 * use 'type' prop. You also can set, is input for vertical form, or for
 * horizontal by setting 'vertical' prop.
 */
export default class FormGroup extends Component {
  static propTypes = {
    type: PropTypes.oneOf([
      'text',
      'number',
      'radio',
      'email',
      'password',
      'checkbox',
      'select',
      'date',
      'daterange',
      'textarea',
      'tel',
      'url',
      'search'
    ]),
    labelStyle: PropTypes.object,
    style: PropTypes.object,
    labelAlign: PropTypes.oneOf(['center', 'baseline', 'flex-start'])
  }

  static defaultProps = {
    type: 'text',
    labelStyle: {},
    labelAlign: 'center'
  }
  get inputId() {
    const { id, type, name, label } = this.props;
    return id || `input-${type}-${name}-${label}`;
  }

  get inputComponent() {
    const {
      type,
      value,
      onChange,
      className,
      children,
      name,
      validationMessages,
      id,
      options,
      valueKey,
      labelKey,
      clearable,
      placeholder,
      disabled,
      autocomplete,
      autocompleteOptions,
      optionRenderer,
      onAutocompleteSelect,
      onAutocompleteStart,
      onAutocompleteEnd,
      hasSearch,
      disableDateFunc,
      vertical,
      onKeyDown,
      onFocus,
      onBlur,
      otherProps,
      rows,
      pending,
      newSelect,
      maxLength
    } = this.props;

    if (!!children) {
      return children;
    }

    if (type === 'textarea') {
      return (<Textarea rows={rows} value={value} onChange={onChange} name={name} disabled={disabled} onKeyDown={onKeyDown} id={this.inputId} invalid={!!validationMessages} ref={(component) => {
        if (!!component) {
          this.input = component
        }
      }} placeholder={placeholder} className={classnames('fw-form-group__textarea', className, { 'fw-form-group__textarea--vertical': vertical })} />)
    }

    if (type === 'select') {
      return (<Select value={value} onChange={onChange} name={name} placeholder={placeholder} hasSearch={hasSearch} newSelect={newSelect} disabled={disabled} vertical={vertical} id={this.inputId} invalid={!!validationMessages} clearable={clearable} options={options} valueKey={valueKey} labelKey={labelKey} className={classnames('fw-form-group__select', className, { 'fw-form-select--vertical': vertical })} />)
    }
    if (type === 'date') {
      return (<DatePicker value={value} onChange={onChange} name={name} disabled={disabled} disableDateFunc={disableDateFunc} clearable={clearable} id={this.inputId} invalid={!!validationMessages} />)
    }

    if (type === 'daterange') {
      return (<DatePicker type="range" value={value} onChange={onChange} name={name} disabled={disabled} disableDateFunc={disableDateFunc} clearable={clearable} id={this.inputId} invalid={!!validationMessages} />)
    }
    return (<Input type={type} value={value} onChange={onChange} name={name} onFocus={onFocus} onBlur={onBlur} maxLength={maxLength} ref={(component) => {
      if (!!component) {
        this.input = component.input
      }
    }} placeholder={placeholder} disabled={disabled} autocomplete={autocomplete} id={this.inputId} invalid={!!validationMessages} autocompleteOptions={autocompleteOptions} optionRenderer={optionRenderer} onAutocompleteStart={onAutocompleteStart} onAutocompleteEnd={onAutocompleteEnd} onAutocompleteSelect={onAutocompleteSelect} onKeyDown={onKeyDown} className={classnames('fw-form-group__input', className, { 'fw-form-group__input--vertical': vertical })}
      {...otherProps} pending={pending} />);
  }

  render() {
    const {
      label,
      labelAlign,
      validationMessages,
      labelStyle,
      vertical,
      style,
      disabled,
      className,
      inputContainerClassName,
      required
    } = this.props;
    const inputContainerStyles = {};
    if (!!labelStyle && !!labelStyle.width) {
      inputContainerStyles.width = `calc(100% - ${labelStyle.width} - 15px)`;
    }
    if (labelStyle && labelStyle.height) {
      labelStyle.instruction ? 
        inputContainerStyles.width = `calc(100% - ${labelStyle.width} - 28px)`
      : inputContainerStyles.width = `calc(100% - ${labelStyle.width} - 50px)`
      inputContainerStyles.height = labelStyle.height;
    }

    let msgs = '';
    if (!!validationMessages && !!validationMessages.join) {
      msgs = validationMessages.join('\n');
    } else {
      msgs = validationMessages;
    }

    return (<div className={classnames('fw-form-group', className, { 'fw-form-group--vertical': vertical })} style={style}>
      {
        !!label && (<label htmlFor={this.inputId} className={classnames('fw-form-group__label', {
          'fw-form-group__label--invalid': !!validationMessages,
          'fw-form-group__label--disabled': disabled,
          'fw-form-group__label--vertical': vertical
        })} style={{
          alignSelf: labelAlign,
          ...labelStyle
        }}>
          {label} {required && <span className="fw-form-group__label--required">*</span>}
        </label>)
      }
      <div className={classnames('fw-form-group__input-container', {
        'fw-form-group__input-container--vertical': vertical,
        [inputContainerClassName]: !!inputContainerClassName
        })} style={inputContainerStyles}>
        <Tooltip type="validation-message" body={msgs}>
          {this.inputComponent}
        </Tooltip>
      </div>
    </div>);
  }
}
