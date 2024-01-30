import React, { Component, createRef, } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import moment from 'moment';
import 'react-dates/initialize';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';

import Button from '../../components/Button';

/**
 * DatePicker is wrapper on SingleDatePicker from react-dates by Air BNB
 * In this wrapper we use dirty hack: we put empty div on page and
 * SingleDatePicker appends to "#portal-container"  div. We need this for
 * resolve problem with hiding datepicker in parents with some overflow.
 * And when there will be window resize, or, opening navigation second layer, or
 * any other thing, we should call placeDatepicker method.
 * */
export default class Single extends Component {
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

  state = {
    focused: false,
    date: null
  }

  constructor(props) {
    super(props);
    this.container = createRef();
  }

  componentDidMount() {
    this.setDate(this.props.value);
    this.input.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    this.input.removeEventListener('keydown', this.handleKeyDown);
  }


  componentDidUpdate() {
    if(!!this.cursorPosition) {
      this.input.setSelectionRange(this.cursorPosition, this.cursorPosition);
      this.cursorPosition = null;
    }
  }

  @autobind handleFocusChange({ focused }) {
    if(typeof focused === 'boolean') {
      this.setState({ focused });
    }
  }

  @autobind handleChange(date) {
    const { onChange, format } = this.props;
    this.setState({ date });
    if (!!date && !!onChange) {
      onChange((!!date && !!date.format) ? date.format(format) : date, date);
    }
  }

  @autobind handleKeyDown({key}) {
    if(key === 'Backspace' && this.input.selectionStart !== 0) {
      this.cursorPosition = this.input.selectionStart - 1;
    } else if(key === 'Enter') {
      if(!!this.state.date && this.value === this.state.date.format(this.props.format)) {
        this.setState({focused: false});
      } else {
        this.value = this.input.value;
      }
    } else if(key === 'Escape') {
      this.setState({ focused: false });
    }
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

  @autobind setDate(date) {
    this.setState({date: !!date ? moment(date) : null});
  }

  componentWillReceiveProps({value}) {
    this.setDate(value);
  }

  get input() {
    if(!this.container.current) {
      return null;
    }
    return this.container.current.querySelector('input');
  }

  get value() {
    const { format } = this.props;
    return moment(this.input.value).format(format);
  }

  set value (val = this.value) {
    const { format, onChange } = this.props;
    const date = moment(val);
    if(!!val && date.isValid()) {
      const dateStr = date.format(format);
      this.input.value = dateStr;
      this.setState({ date });
      if(!!onChange) {
        onChange(dateStr, date);
      }
    }
  }


  render() {
    const { focused, date, style } = this.state;
    const { disabled, disableDateFunc, clearable } = this.props;
    return (
      <div className="fw-datepicker" style={style} ref={this.container}>
        <SingleDatePicker date={date} focused={focused} placeholder={this.props.format}
          isOutsideRange={disableDateFunc}
          withPortal={false} disabled={disabled}
          onFocusChange={this.handleFocusChange}
          onDateChange={this.handleChange} />
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
