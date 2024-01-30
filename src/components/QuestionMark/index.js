import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '../../components/Tooltip';
const QuestionMark = ({tooltip, tooltipWidth, tooltipPosition, marginLeft, className}) => (
  <Tooltip style={{ display: 'inline-block', marginLeft: marginLeft}} body={tooltip}
      bodyStyle={{maxWidth: `${tooltipWidth}px`, fontSize: '12px'}}
      position={tooltipPosition} className={className}>
    <i className="pe-7s-help1 icon icon--help icon--bold"></i>
  </Tooltip>
);

QuestionMark.propTypes = {
  tooltip: PropTypes.any,
  tooltipWidth: PropTypes.number,
  tooltipPosition: PropTypes.oneOf(['top', 'left', 'bottom', 'right']),
}

QuestionMark.defaultProps = {
  tooltipWidth: 300,
  tooltipPosition: 'top'
}

export default QuestionMark;