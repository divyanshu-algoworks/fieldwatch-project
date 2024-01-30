import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from '../../components/Dialog';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';


/**
 * ExistIncidentUrlDialog is component for dialog, which will opened, when user
 * try to save incident with links, that already exist in another incidents.
 */
export default class ExistIncidentUrlDialog extends Component {
  z
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    onMerge: PropTypes.func,
    // existIncidents: PropTypes.oneOf([PropTypes.arrayOf(PropTypes.shape({
    //   incident_id: PropTypes.string,
    //   url: PropTypes.string,
    // }))], PropTypes.object),
    title: PropTypes.string,
    confirmText: PropTypes.string,
  };

  handleConfirm = () => {
    const { onConfirm, } = this.props;
    onConfirm();
  }



  render() {
    const { isOpen, existIncidents, onClose, title, confirmText, onMerge, showMergeBtn } = this.props;

    return (
      <Dialog isOpen={isOpen} onClose={onClose}>
        <Dialog.Header onClose={onClose}>
          {title}
        </Dialog.Header>
        <Dialog.Body>
          {existIncidents && existIncidents.map(({ incident_id, url }) => (
            <div className="mb-10" key={incident_id}>
              <a target="_blank" href={url}>{incident_id}</a>
              {!!showMergeBtn && (
                <IconButton icon="pe-7s-copy-file" tooltip="Merge" onClick={() => onMerge(incident_id)} />
              )}
            </div>
          ))}
        </Dialog.Body>

        <Dialog.Footer>
          <Button status="black" onClick={onClose}>Close</Button>
          <Button onClick={this.handleConfirm}>{confirmText}</Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
