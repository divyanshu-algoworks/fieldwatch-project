import React, { Component } from 'react';
import classnames from 'classnames';
/**
 * Preloader is component with animated spinner. Use, when we need to use
 * spinner in some container (not globaly)
 */
export default class Preloader extends Component {
  render() {
    const { height, fixed, small, className, ...otherProps } = this.props;
    return (
      <div className={classnames('preloader', { 'preloader--fixed': fixed }, className)} {...otherProps}>
        <div className={classnames('preloader__overlay', { 'preloader__overlay--small': small })} style={{ height }}>
          <div className={classnames('preloader__icon', { 'preloader__icon--small': small })} ref={div => this.spinnerContainer = div}>
          </div>
        </div>
      </div>
    );
  }
}
