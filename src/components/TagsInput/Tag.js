import React from 'react';
import Button from 'Components/Button';
import { observer } from 'mobx-react';
import classnames from 'classnames';

const Tag = ({ tag, onRemove, disabled }) => (
  <div className={classnames('tags-input__tag', {
    'tags-input__tag--disabled': disabled
  })}>
    <Button status="link" className="tags-input__tag-remove" disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onRemove(tag) }}>&times;</Button>
    <div className="tags-input__tag-name">{tag.name}</div>
  </div>
);

export default observer(Tag);
