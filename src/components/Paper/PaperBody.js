import React from 'react';
import classnames from 'classnames';
export default ({ form, children, style }) => (
  <div className={classnames('paper__body', {'paper__body--form': form})} style={style}>
    {children}
  </div>
);
