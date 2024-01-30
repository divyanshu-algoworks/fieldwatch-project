import React from 'react';
import Collapse from 'Components/Collapse';
import FormGroup from 'Components/FormGroup';
import Checkbox from 'Components/Input/Checkbox';
import QuestionMark from 'Components/QuestionMark';
import { toggleItemPresence } from 'Helpers/array';

const SearchSystem = ({ label, checked, onChange }) => {
  function handleChange({ target }) {
    onChange(label, target.checked);
  }
  return (
    <div className="grid__row">
      <div className="grid__col grid__col--12">
        <Checkbox label={label} checked={checked} onChange={handleChange} />
      </div>
    </div>
  );
}

export const SearchSystemsInput = ({ searchSystems, value, onChange }) => {
  function handleChange(item) {
    onChange(toggleItemPresence(value, item));
  }
  return (
    <div className="grid__row">
      <div className="grid__col grid__col--12">
        <FormGroup
          labelAlign="baseline"
          labelStyle={{ width: '190px' }}
          label={(
            <div>
              Search Systems
            <div className="d-ib ml-10">
                <QuestionMark tooltip="Choose which search systems query will use as data sources." />
              </div>
            </div>
          )}>
          <Collapse collapseText="Hide Search Systems" expandText="Show Search Systems">
            <div className="grid__row"></div>
            {searchSystems.map(searchSystem => (
              <SearchSystem key={searchSystem} label={searchSystem} onChange={handleChange}
                checked={value.indexOf(searchSystem) > -1} />
            ))}
          </Collapse>
        </FormGroup>
      </div>
    </div>
  );
}
