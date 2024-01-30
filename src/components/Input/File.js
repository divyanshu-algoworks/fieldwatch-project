import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
/**
 * File is component for input type 'file' component.
 */
export default class File extends Component {
  static propTypes = {
    /** label for input& It need for stylink and set custom text for file input
     * trigger button. We hide input and show label.
     */
    label: PropTypes.node
  }

  /**
   * In this handler we check, is there some files in input, and if not, we just
   * will not call onChange event
   * @param {object} e event handler
   */
  @autobind handleChange(e) {
    const { onChange } = this.props;
    if (!e.target.files.length || !onChange) {
      return;
    }
    onChange(e);
  }

  render() {
    const { label, ...inputProps } = this.props;
    const heightClass = this.props.heightClass 
    return (
      <label className={`fw-input-label ${heightClass ? heightClass : ''}`}>
        {label}
        <input type="file" {...inputProps} onChange={this.handleChange} />
      </label>);
  }
}
