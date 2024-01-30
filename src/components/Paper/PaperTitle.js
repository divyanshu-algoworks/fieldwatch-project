import React from 'react';
import classnames from 'classnames';
export default ({ children, small }) => (
  <h2 className={
    classnames('paper__title', { 'paper__title--small': small })
  }>{children}</h2>
);
