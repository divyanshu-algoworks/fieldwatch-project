import React, {Component} from 'react';
import PropTypes from 'prop-types'
import DropdownButton from 'Components/DropdownButton';

export default class MergeFields extends Component {
  static propTypes = {
    mergeFields: PropTypes.array,
    handleSelect: PropTypes.func,
    buttonLabel: PropTypes.string,
  }

  render() {
    const { mergeFields, handleSelect, buttonLabel } = this.props;

    return (
      <div className="clearfix mt-10 mb-m5">
        <div className="f-r">
          { mergeFields && (
            <DropdownButton
              size="small"
              status="black"
              options={mergeFields}
              onOptionSelect={(val) => handleSelect(val)}
            >
              { buttonLabel }
            </DropdownButton>
          )}
        </div>
      </div>
    );
  }
}
