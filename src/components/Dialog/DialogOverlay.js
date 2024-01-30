import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export default class ModalOverlay extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
  }

  get dom() {
    const { isOpen, children, overlayStyle } = this.props;
    if (!isOpen) {
      return null;
    }

    return (
      <div className="dialog-overlay" key="dialog-overlay"
        ref={div => this.overlay = div} style={overlayStyle}
        onDoubleClick={this.handleDBClick}>{children}</div>
    );
  }

  componentWillReceiveProps({ isOpen }) {
    if (isOpen) {
      document.body.classList.add('body-with-open-modal');
      document.addEventListener('keydown', this.handleKeydown);
      document.addEventListener('touchmove', this.handleDisableScrollTablet);
    } else {
      document.body.classList.remove('body-with-open-modal');
      document.removeEventListener('keydown', this.handleKeydown);
      document.removeEventListener('touchmove', this.handleDisableScrollTablet);
    }
  }

  @autobind handleKeydown({ key }) {
    const { onClose } = this.props;
    if (key === 'Escape') {
      onClose();
    }
  }

  @autobind handleDisableScrollTablet(e) {
    e.preventDefault();
  }

  @autobind handleDBClick({ target }) {
    const { onClose } = this.props;
    if (target === this.overlay) {
      onClose();
    }
  }
  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="dialog"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {this.dom}
      </ReactCSSTransitionGroup>
    );
  }
}
