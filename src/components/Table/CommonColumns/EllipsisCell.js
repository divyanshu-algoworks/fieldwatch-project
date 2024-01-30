import React from 'react';
import Tooltip from 'Components/Tooltip';

const EllipsisCell = ({ children, tooltip, width, disabled = false }) => (
  <Tooltip body={tooltip || children} className="d-ib">
    <div
      className={`ellipsis d-ib ${disabled ? 'disabled_element' : ''} `}
      style={{ maxWidth: width, cursor: 'pointer' }}
    >
      {children}
    </div>
  </Tooltip>
);

EllipsisCell.defaultProps = {
  width: '200px',
};

export default EllipsisCell;
