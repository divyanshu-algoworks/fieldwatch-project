import React from 'react';
import Button from 'Components/Button';
import { observer } from 'mobx-react';
import classnames from 'classnames';

const SelectedRepresentative = ({ rep, onRemove, disabled }) => (
  <div className={classnames('tags-input__tag', {
    'tags-input__tag--disabled': disabled
  })}>
    <Button status="link" className="tags-input__tag-remove" disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onRemove(rep) }}>&times;</Button>
    <div className="tags-input__tag-name">{rep.first_name} {rep.last_name} ({rep.rep_id})</div>
  </div>
);

export default observer(SelectedRepresentative);
