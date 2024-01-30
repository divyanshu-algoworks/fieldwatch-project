import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Fieldwatch button component
 */
export default class Button extends Component {
  static propTypes = {
    /** Is button disabled */
    disabled: PropTypes.bool,
    /** Button type */
    type: PropTypes.oneOf(['button', 'submit', 'link', 'label']),
    /** responsible for button background */
    status: PropTypes.oneOf(['white', 'blue', 'orange', 'black', 'link', 'red']),
    /** font size */
    size: PropTypes.oneOf(['default', 'big', 'small'])
  }

  static defaultProps = {
    type: 'button',
    status: 'blue',
    size: 'default'
  }

  get className() {
    const { type, status, className, size, disabled } = this.props;
    return classnames(
      'button',
      {
        'button--disabled': !!disabled,
        [`button--${status}`]: true,
        [`button--${size}`]: true,
      },
      className
    );
  }

  render() {
    if (this.props.type === 'label') {
      return (<span ref={(dom) => this.dom = dom} className={this.className}>{this.props.children}</span>);
    }
    if (this.props.type === 'link') {
      const { type, status, ...linkProps } = this.props;
      return <a ref={(dom) => this.dom = dom} {...linkProps} className={this.className} />
    }

    return (<button ref={(dom) => this.dom = dom} {...this.props} className={this.className} />);
  }
}
