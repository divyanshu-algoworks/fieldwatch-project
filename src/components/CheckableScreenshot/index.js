import React from 'react';
import classnames from 'classnames';
import Tooltip from 'Components/Tooltip';

export const CheckableScreenshot = ({ className, checked, onChange, item }) => {
  const containerClassName = classnames('checkable-screenshot', className);
  function handleClick() {
    onChange(item, !checked);
  }

  return (
    <div className={containerClassName} onClick={handleClick}>
      {!!checked && (
        <div className="checkable-screenshot__indicator">✓</div>
      )}
      <div className="checkable-screenshot__img-container">
        <img src={item.url} style={{ width: '100%', minHeight: '40px', }}
          className="checkable-screenshot__image" />
      </div>
      {!!item.name && (
        <Tooltip body={item.name}>
          <div className="checkable-screenshot__file-name ellipsis">{item.name}</div>
        </Tooltip>
      )}
    </div>
  );
}
