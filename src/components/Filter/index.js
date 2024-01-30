import React, { useRef } from 'react';
import * as Labels from './Labels';
import * as Dialogs from './Dialogs';

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

const Filter = (props) => {
  const type = capitalize(props.type);
  const Label = Labels[type];
  const Dialog = Dialogs[type];
  const dialogRef = useRef();
  function labelClick() {
    dialogRef.current.open(props.data);
  }
  if (!Label || !Dialog) {
    console.warn(`No filter for ${type} type.`);
    return null;
  }
  return (
    <div className="fw-filter">
      <Label {...props} onClick={labelClick} />
      <Dialog {...props} ref={dialogRef} />
    </div>
  );
}

export default Filter;
