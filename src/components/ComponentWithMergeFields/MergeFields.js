import React from 'react';
import PropTypes from 'prop-types'
import DropdownButton from 'Components/DropdownButton';

const mergeFields = ({mergeFields, handleSelect, buttonLabel, alignRight}) => {
  return !!mergeFields && (
    <DropdownButton
      size="small"
      status="black"
      listAlign={alignRight ? 'right' : 'left'}
      options={mergeFields}
      onOptionSelect={(val) => handleSelect(val)}
    >
      { buttonLabel }
    </DropdownButton>
  );
};

mergeFields.propTypes = {
  mergeFields: PropTypes.array,
  handleSelect: PropTypes.func,
  buttonLabel: PropTypes.string,
};

export default mergeFields;