import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal, } from 'react-dom';
import classnames from 'classnames';

/**
 * Fieldwatch tooltip component
 */
export default class Tooltip extends Component {
  static propTypes = {
    /** Is tooltip on top or on bottom from target */
    position: PropTypes.oneOf(['top', 'bottom', 'right', 'left']),
    /** Tooltip background color */
    type: PropTypes.oneOf(['default', 'validation-message', 'info']),
    /** Tooltip message */
    body: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    visible: PropTypes.bool,
    bodyStyle: PropTypes.object,
  };

  static defaultProps = {
    position: 'top',
    type: 'default',
  };

  state = {
    isTooltipVisible: false
  };

  get bodyPosition() {
    if (!this.trigger) {
      return {};
    }
    const { position } = this.props;
    const rect = this.trigger.getBoundingClientRect();
    let left, top;
    if (position === 'top') {
      left = rect.left + rect.width / 2;
      top = window.scrollY + rect.top;
    }
    if (position === 'bottom') {
      left = rect.left + rect.width / 2;
      top = window.scrollY + rect.top + rect.height;
    }
    if (position === 'right') {
      left = rect.left + rect.width;
      top = window.scrollY + rect.top + rect.height;
    }
    if (position === 'left') {
      left = rect.left;
      top = window.scrollY + rect.top + rect.height;
    }
    return { left, top };
  }

  get content() {
    const { body } = this.props;
    if (typeof body === 'string') {
      return (
        <div dangerouslySetInnerHTML={{ __html: body }}></div>
      );
    }
    return body;
  }

  get body() {
    const { body, position, bodyStyle, visible } = this.props;
    let { type } = this.props;
    const { isTooltipVisible } = this.state;

    if(this.props.renderedBy === 'policies') {
      type = 'gray'
    }

    if (!!body && (!!isTooltipVisible || !!visible)) {
      return createPortal(
        (<div ref={(div) => this.tooltipBody = div}
          className={classnames(
            'tooltip-body',
            [`tooltip-body--${type}`],
            [`tooltip-body--${position}`]
          )}
          style={{ ...this.bodyPosition, ...bodyStyle }}>
          {this.content}
        </div >),
        document.getElementById('portal-container')
      );
    }
    return null;
  }

  handleMouseEnter = () => {
    this.setState({ isTooltipVisible: true });
  }

  handleMouseLeave = () => {
    this.setState({ isTooltipVisible: false });
  }

  render() {
    const { children, className, style, visible } = this.props;
    return (
      <div className={classnames('tooltip-container', className)} style={style}
        ref={div => this.trigger = div}
        onMouseEnter={(visible === undefined) ? this.handleMouseEnter : undefined}
        onMouseLeave={(visible === undefined) ? this.handleMouseLeave : undefined}>
        {children}
        {this.body}
      </div>
    );
  }
}
