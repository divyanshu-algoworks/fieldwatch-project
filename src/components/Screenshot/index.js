import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from 'Components/Button';
import ProgressBar from 'Components/ProgressBar';

/**
 * Screenshot is component for every screenshot img in incident form. When
 * screenshot marked as destroyed, there should be Recover button. Also
 * screenshot has uploading progress bar.
 */
export default class Screenshot extends Component {
  static propTypes = {
    className: PropTypes.string,
    imgContainerClassName: PropTypes.string,
    /** screenshot image className */
    imgClassName: PropTypes.string,
    /** screenshot url */
    url: PropTypes.string,
    /** screenshot id */
    id: PropTypes.number,
    /** screenshot file name */
    name: PropTypes.string,
    /** is screenshot marked as destroyed flag */
    _destroy: PropTypes.bool,
    /** Handler to destroy screenshot */
    onDestroy: PropTypes.func,
    /** uploading progress in % */
    progress: PropTypes.number,
    /** screenshot click handler */
    onClick: PropTypes.func,
    /** when screenshot disabled, you can't click, remove or recover it. */
    disabled: PropTypes.bool,
  };

  @autobind handleDestroy(e) {
    e.stopPropagation();
    const { onDestroy, id, onUnbind } = this.props;
    onDestroy(id);
    onUnbind(id);
  }

  @autobind handleRecover(e) {
    e.stopPropagation();
    const { onRecover, id } = this.props;
    onRecover(id);
  }

  render() {
    const { className, imgClassName, imgContainerClassName, url, id, name,
      _destroy, canDestroy, progress, onClick, disabled } = this.props;
    return (
      <div className={classnames('screenshot', className)}>
        <ProgressBar progress={progress} className="screenshot__progress" />
        <div className={('screenshot__img-container', imgContainerClassName)}>
          <img className={classnames('screenshot__img', { 'screenshot__img--destroyed': _destroy }, imgClassName)} src={url}
            onClick={() => !disabled && onClick({ id, url, name })} />
        </div>
        {!!_destroy && (
          <Button status="link" onClick={this.handleRecover}
            disabled={disabled}
            className="screenshot__recover">
            Recover
          </Button>
        )}
        <div className="screenshot__info">
          <div className="screenshot__name">{name}</div>
          {(!_destroy && !!canDestroy) && (
            <Button status="link" onClick={this.handleDestroy} disabled={disabled}>
              <i className="pe-7s-trash icon icon--bold"></i>
            </Button>
          )}
        </div>
      </div>
    );
  }
}
