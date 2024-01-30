import React, { Component } from 'react';
import DialogOverlay from '../Dialog/DialogOverlay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class MagnifierOverlay extends DialogOverlay {
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="magnifier"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        <div className="magnifier-overlay" key="magnifier-overlay"
          ref={div => this.overlay = div}
          onClick={this.handleDBClick}>{this.props.children}</div>
      </ReactCSSTransitionGroup>
    );
  }
}
