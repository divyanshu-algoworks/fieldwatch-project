import React, { forwardRef } from 'react';
import classnames from 'classnames';

export default forwardRef(({ children, form, style }, ref) => (
  <div ref={ref} className={classnames('dialog__body', { 'dialog__body--form': !!form })}
    style={style}>
    {children}
  </ div>
));
