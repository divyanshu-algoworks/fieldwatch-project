import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import Tooltip from '../Tooltip';

const listIconButton = ({tooltip, icon, fontWeight,tooltipClassName, ...buttonProps}) => (
  // <Tooltip body={tooltip} className="tooltip-container--table-action-tooltip">
    <Button status="link" {...buttonProps} type={!!buttonProps.href ? 'link' : 'button'}>
      <i className={icon} style={{fontSize: '18px', fontWeight: fontWeight ? fontWeight: 700}}></i>
    </Button>
  // </Tooltip>
);

listIconButton.propTypes = {
  icon: PropTypes.string,
  onClick: PropTypes.func,
  tooltip: PropTypes.any
}

export default listIconButton;