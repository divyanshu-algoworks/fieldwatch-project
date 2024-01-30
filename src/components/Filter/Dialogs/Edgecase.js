import React from 'react';
import Checkbox from '../../Input/Checkbox';
import Common from './Common';

const EdgecaseCheckbox = ({ index, checked, label, onChange }) => {
  function handleChange({ target }) {
    onChange(index, target.checked);
  }
  return (<Checkbox label={label} checked={checked} onChange={handleChange} />);
}

export class Edgecase extends Common {
  handleChange = (index, checked) => {
    const { data } = this.state;
    if (index === 0 && checked) {
      this.setState({ data: data[0] === false ? [true, false] : [true] });
    } else if (index === 0 && !checked) {
      this.setState({ data: data[1] === false ? [false] : [] });
    } else if (index === 1 && checked) {
      this.setState({ data: data[0] === true ? [true, false] : [false] });
    } else if (index === 1 && !checked) {
      this.setState({ data: data[0] === true ? [true] : [] });
    }
  }

  get dialogBody() {
    const { data } = this.state;
    const { existLabel, notExistLabel } = this.props;
    if (!data) {
      return;
    }
    const isFirstChecked = data[0] === true;
    const isSecondChecked = (data[0] === false || data[1] === false);

    return (
      <div className="grid">
        <div className="grid__row">
          <div className="grid__col grid__col--4 filter-dialog__checkbox">
            <EdgecaseCheckbox checked={isFirstChecked} label={existLabel}
              index={0} onChange={this.handleChange} />
          </div>
          <div className="grid__col grid__col--4 filter-dialog__checkbox">
            <EdgecaseCheckbox checked={isSecondChecked} label={notExistLabel}
              index={1} onChange={this.handleChange} />
          </div>
        </div>
      </div>
    );
  }
}
