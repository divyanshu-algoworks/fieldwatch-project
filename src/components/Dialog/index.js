import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DialogOverlay from './DialogOverlay';
import DialogContainer from './DialogContainer';
import DialogHeader from './DialogHeader';
import DialogBody from './DialogBody';
import DialogFooter from './DialogFooter';


/**
 * Dialog is component for modals realization
 */
export default class Dialog extends Component {
  static propTypes = {
    /** is dialog open */
    isOpen: PropTypes.bool,
    /** Callback for onOpen */
    onOpen: PropTypes.func,
  }
  /**
   * Hide scroll when dialog is open
   * @param {object} nextProps component props
   */
  componentWillReceiveProps(nextProps) {
    document.body.classList.toggle('body--with-dialog', !!nextProps.isOpen);

    if (!this.props.isOpen && !!nextProps.isOpen && (typeof nextProps.onOpen === 'function')) {
      nextProps.onOpen(nextProps);
    }
  }

  static Header = DialogHeader;
  static Body = DialogBody;
  static Footer = DialogFooter;

  render() {
    return (
      <DialogOverlay {...this.props}>
        <DialogContainer {...this.props}>
        </DialogContainer>
      </DialogOverlay>
    );
  }
}
