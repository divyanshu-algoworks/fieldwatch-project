import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class ModalContainer extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['small', 'default', 'large'])
  };

  static defaultProps = {
    size: 'default'
  };

  render() {
    const { children, size, className, setMarginTop } = this.props;
    return (
      <ReactCSSTransitionGroup
        transitionName="dialog"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        <div className={classnames(setMarginTop ? 'dialog--margin' : 'dialog', `dialog--${size}`, className)}
          key="dialog-container">
          {children}
        </div>
      </ReactCSSTransitionGroup>
    );
  }
}
