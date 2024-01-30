import React, { Component } from 'react';

import InputWithTimeout from './InputWithTimeout';

/**
 * Search is component for input type search. It uses functionality from
 * InputWithTimeout + render search icon at left part of input
 */
export default class Search extends InputWithTimeout {
  get searchIconPosition() {
    if (!this.input) {
      return {};
    }
    const rect = this.input.getBoundingClientRect();
    const { left, width, height } = rect;
    const top = document.body.scrollTop + rect.top + 8;
    const iconLeft = left + 5;
    return { top, left: iconLeft };
  }
  render() {
    const { className } = this.props;
    const { value, timeoutValue } = this.state;

    return (
      <div className="search-input">
        <i className="search-input__icon pe-7s-search"></i>
        <input {...this.props} type="search" onBlur={this.handleBlur}
          value={(timeoutValue === undefined) ? value : timeoutValue || ''} key="input"
          placeholder="Search"
          className={`${className} search-input__input`}
          ref={input => { if (!!input) this.input = input }}
          onChange={this.handleChange} />

      </div>
    );
  }
}
