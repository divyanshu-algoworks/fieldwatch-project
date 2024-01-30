import React from 'react';
import classnames from 'classnames';
import Button from 'Components/Button';

const ActionPanelButton = ({ buttonText, collapsed, text, propName, method, onClick }) => (
  <div className="incidents-actions-panel__action" onClick={onClick}
    data-prop-name={propName} data-method={method}>
    <Button className={classnames('incidents-actions-panel__button', {
      'incidents-actions-panel__button--moved': !!collapsed,
    })}>
      {buttonText}
    </Button>
    <div className="incidents-actions-panel__action-text">{text || `Change ${propName}`}</div>
  </div>
);

export default ActionPanelButton;
