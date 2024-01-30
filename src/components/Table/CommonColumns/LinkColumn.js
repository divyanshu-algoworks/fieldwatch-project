import React from 'react';
import PropTypes from 'prop-types';

const LinkColumn = ({ hrefKey, textKey, item, style }) => (
  <div className="table-link" style={style}>
    <a href={item[hrefKey]} target="_blank">{item[textKey || hrefKey]}</a>
  </div>
)

LinkColumn.propTypes = {
  hrefKey: PropTypes.string.isRequired,
  textKey: PropTypes.string
}

export default LinkColumn;
