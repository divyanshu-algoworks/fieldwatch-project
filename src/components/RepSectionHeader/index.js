import React from 'react';

const RepSectionHeader = ({ rep_label, fieldsUrl, id }) => {
  if (!!id) {
    return (
      <a href={`${fieldsUrl}?representative_id=${id}`} target="_blank">
        {rep_label}
      </a>);
  }

  return <span>{rep_label}</span>;
}

RepSectionHeader.defaultProps = {
  rep_label: 'Representative'
}


export default RepSectionHeader;
