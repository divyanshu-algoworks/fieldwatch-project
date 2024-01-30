import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Tooltip from 'Components/Tooltip';
import Button from 'Components/Button';

const listIconButton = ({tooltip, icon, ...buttonProps}) => (
  <Tooltip body={tooltip} className="table-actions__tooltip-container">
    <Button className="table-actions__button" status="link" {...buttonProps}>
      <i className={classnames('icon', 'icon--button', 'icon--bold', icon)}></i>
    </Button>
  </Tooltip>
);

listIconButton.propTypes = {
  tooltip: PropTypes.string,
  tooltipClassName: PropTypes.string,
  icon: PropTypes.string,
}

export default listIconButton;