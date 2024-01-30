import React from 'react';
import { autobind } from 'core-decorators';

import Button from 'Components/Button';
import Tooltip from 'Components/Tooltip';
import Input from 'Components/Input';
import FilterDialog from './FilterDialog';
import { getClientType } from 'Helpers/cookie';

export default class ChecklistDialog extends FilterDialog {
  @autobind handleChangeCheckbox(item, checked) {
    const { data } = this.state;
    const index = data.indexOf(item);
    const newData = [].concat(
      data.slice(0, index),
      { ...item, checked },
      data.slice(index + 1)
    );
    this.setState({ data: newData });
  }

  @autobind applyForAllCheckboxes(checked) {
    this.setState({ data: this.state.data.map(item => { return { ...item, checked } }) });
  }

  get dialogBody() {
    const { data } = this.state;
    const { checkboxLabelFn } = this.props;
    const isNonFWClient = ['fc'].includes(getClientType());
    if (!data) {
      return;
    }
    return (
      <div className="grid">
        <div className="grid__row">
          <div className="grid__col grid__col--12">
            <Button size="small" className={`${isNonFWClient ? 'disabled_element' : ''}`} onClick={() => this.applyForAllCheckboxes(true)}>Check All</Button>
            <Button size="small" className={`${isNonFWClient ? 'disabled_element' : ''}`} onClick={() => this.applyForAllCheckboxes(false)}>Uncheck All</Button>
          </div>
        </div>
        <div className="grid__row">
          {data.map(item => {
            const label = checkboxLabelFn ? checkboxLabelFn(item) : item.name;
            return (
              <div className="grid__col grid__col--4 filter-dialog__checkbox" key={item.id}>
                <Tooltip body={label}>
                  <Input type="checkbox" checked={item.checked} label={label}
                    onChange={({ target }) => this.handleChangeCheckbox(item, target.checked)} />
                </Tooltip>
              </div>
            )
          })}
        </div>
      </div>
    );
  }
}
