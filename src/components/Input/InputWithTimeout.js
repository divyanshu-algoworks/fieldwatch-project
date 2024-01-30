import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

import DefaultInput from './DefaultInput';

/**
 * InputWithTimeout component uses for calling onChange after some pouse (
 * like input with autocomplete. It will not send ajax request on server
 * everytime, when user enter symbol)
 */
export default class InputWithTimeout extends DefaultInput {
  static propTypes = {
    /** Delay for call onChange handler from props */
    timeout: PropTypes.number,
    /** If true, then should be spinner in right part of input */
    processing: PropTypes.bool,
    /** Change input event handler */
    onChange: PropTypes.func,
    /** Blur input event handler */
    onBlur: PropTypes.func,
    /** Start timeout handler */
    onTimeoutStart: PropTypes.func,
    /** End timeout handler */
    onTimeoutEnd: PropTypes.func,
  }

  static defaultProps = {
    timeout: 500
  }

  get iconPosition() {
    if (!this.input) {
      return {};
    }
    const rect = this.input.getBoundingClientRect();
    const { left, width, height } = rect;
    const top = document.body.scrollTop + rect.top + 7;
    const iconLeft = left + width - 20;
    return { top, left: iconLeft };
  }

  /**
   * Handler for blur event. if there is onBlur in component props, it will call
   * after small timeout.
   * @param {object} e event handler
   */
  @autobind handleBlur(e) {
    e.preventDefault();
    const { onBlur } = this.props;
    this.blurTimeout = setTimeout(() => {
      if (!!onBlur) {
        onBlur(e);
      }
    }, 200);
  }

  /**
   * Change input handler. It will call onChange func from props only after
   * timeout, which set in timeout prop.
   * @param {object} e evnt handler
   */
  @autobind handleChange(e) {
    const { timeout, onTimeoutStart, onTimeoutEnd } = this.props;
    this.setState({ timeoutValue: e.target.value });
    if (!!this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    } else if (!!onTimeoutStart) {
      onTimeoutStart(e.target.value, e.target);
    }

    e.persist();

    this.typingTimeout = setTimeout(() => {
      if (!!this.props.onChange) {
        e.target.value = this.state.timeoutValue;
        this.props.onChange(e);
        this.setState({ value: e.target.value, timeoutValue: undefined });
      }
      if (!!onTimeoutEnd) {
        onTimeoutEnd(e.target.value, e.target);
      }
    }, timeout);
  }

  /**
   * clear all timeouts on unmount and call events;
   */
  componentWillUnmount() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    if (!!this.blurTimeout) {
      const { onBlur } = this.props;
      if (!!onBlur) {
        onBlur();
      }
      clearTimeout(this.blurTimeout);
    }

  }

  render() {
    const { value, timeoutValue } = this.state;
    const {
      onTimeoutStart,
      onTimeoutEnd,
      processing,
      ...inputProps
    } = this.props;

    return [
      (<input {...inputProps} onBlur={this.handleBlur} value={(
        timeoutValue === undefined)
        ? value
        : timeoutValue || ''} key="input" ref={input => {
          if (!!input)
            this.input = input
        }} onChange={this.handleChange} />), !!processing && createPortal((<div key="processing-icon" style={{
          position: 'absolute',
          ...this.iconPosition
        }}>
          <i className="fa fa-circle-o-notch fa-spin fa-1x fa-fw"></i>
          <span className="sr-only">Loading...</span>
        </div>), document.getElementById('portal-container')),
    ];
  }
}
