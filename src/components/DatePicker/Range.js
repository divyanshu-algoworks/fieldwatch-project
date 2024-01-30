import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import moment from 'moment';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';

import { isArray } from '../../helpers/array';
import 'react-dates/lib/css/_datepicker.css';

import Button from '../../components/Button';
// TODO: Fix range datepicker
/**
 * DatePicker is wrapper on SingleDatePicker from react-dates by Air BNB
 * In this wrapper we use dirty hack: we put empty div on page and
 * SingleDatePicker appends to "#portal-container"  div. We need this for
 * resolve problem with hiding datepicker in parents with some overflow.
 * And when there will be window resize, or, opening navigation second layer, or
 * any other thing, we should call placeDatepicker method.
 * */
export default class DatePicker extends Component {
  static propTypes = {
    /** Input date value */
    value: PropTypes.any,
    /** Handler for change input's value */
    onChange: PropTypes.func,
    /** Date format mask */
    format: PropTypes.string,
    /** Is datepicker disabled */
    disabled: PropTypes.bool,
    /** Function to disable some dates in datepicker */
    disableDateFunc: PropTypes.func,
    /** DatePicker placeholder */
    placeholder: PropTypes.string,
    /** display clear button flag */
    clearable: PropTypes.bool,
  };

  static defaultProps = {
    format: 'MM/DD/YYYY',
    placeholder: '',
    disableDateFunc: () => false
  }

  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
      startDate: isArray(props.value) ? moment(props.value[0]) : null,
      endDate: isArray(props.value) ? moment(props.value[1]) : null,
    };
  }

  @autobind handleFocusChange({ focusedInput }) {
    this.setState({ focusedInput });
  }

  @autobind handleChange(date) {
    const { onChange, format } = this.props;
    this.setState({ date });
    if (!!onChange) {
      onChange((!!date && !!date.format) ? date.format(format) : date, date);
    }
  }

  @autobind handleRangeChange({ startDate, endDate }) {
    // const { onChange, format } = this.props;
    // this.setState({ date });
    // if (!!onChange) {
    //   onChange((!!date && !!date.format) ? date.format(format) : date, date);
    // }
  }

  @autobind clear(e) {
    e.stopPropagation();
    const { onChange } = this.props;
    this.setState({ date: null });
    if (!!onChange) {
      onChange(null, null);
    }
  }

  /**
   * get coordinates and size for datepicker with position absolute in portal
   * container to put datepicker in correct place
   */
  @autobind placeDatepicker() {
    if (!this.parent) {
      return {};
    }
    const rect = this.parent.getBoundingClientRect();

    this.setState({
      style: {
        top: rect.top + window.scrollY,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
      }
    });
  }

  render() {
    const { focusedInput, date, style, startDate, endDate } = this.state;
    const { disabled, disableDateFunc, placeholder, clearable, type } = this.props;
    return (
      <div className="fw-datepicker" style={style}>
        <DateRangePicker
          startDateId="startDate"
          endDateId="endDate"
          startDate={startDate}
          endDate={endDate}
          focusedInput={focusedInput}
          isOutsideRange={disableDateFunc}
          withPortal={false} disabled={disabled}
          onFocusChange={this.handleFocusChange}
          ref={datepicker => this.datepicker = datepicker}
          onDatesChange={this.handleRangeChange} />
        {!!clearable && !!date && (
          <div className="fw-datepicker__controls">
            <Button status="link" onClick={this.clear} disabled={disabled}>
              &times;
          </Button>
          </div>
        )}
      </div>
    );
  }
}
