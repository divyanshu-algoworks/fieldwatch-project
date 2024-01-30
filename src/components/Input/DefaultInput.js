import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';

/**
 * DefaultInput  ic component for all input tipes, which looks like text input
 * without autocomplete(Like email, password, tel, etc);
 * It has his own state and also has onChange.
 */
export default class DefaultInput extends Component {
  static propTypes = {
    /** input value */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** input change handler */
    onChange: PropTypes.func
  }

  state = { value: this.props.value || '' }

  /**
   * handler for input value change. It change inputs state and call func from
   * 'onChange' prop with event handler as argument
   * @param {object} e event handler
   */
  @autobind handleChange(e) {
    const { onChange } = this.props;
    this.setState({ value: e.target.value });
    onChange(e);
  }

  /**
   * When component get new value from props, it will replace value in state
   * @param {object} param0 component new props
   */
  componentWillReceiveProps({ value }) {
    if (value !== undefined) {
      this.setState({ value });
    }
  }

  get value() {
    return this.state.value;
  }

  render() {
    return (
      <input {...this.props} value={this.state.value} ref={this.input}
        ref={input => { if (!!input) this.input = input }}
        onChange={this.handleChange} />
    );
  }
}
