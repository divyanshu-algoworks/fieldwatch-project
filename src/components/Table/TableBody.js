import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { DragDropContext } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';

import Preloader from '../Preloader';
import { TableRow, DraggableTableRow } from './TableRow';
export const TableBody = observer(({ data, config, rowClassFn, onRowClick, onRowCheck, checkedItems, isRowCheckable, keyFn, loading, }) => {
  let content;
  if (!!loading) {
    content = (<tr><td colSpan={config.length}><Preloader id="table-preloader" /></td></tr>);
  } else if (!data) {
    content = null;
  } else if (!data.length) {
    content = (<TableRow config={config} empty />);
  } else {
    content = data.map(item => (
      (<TableRow key={keyFn ? keyFn(item) : item.id} config={config}
        item={item} rowClassFn={rowClassFn}
        checkedItems={checkedItems} isRowCheckable={isRowCheckable}
        onClick={onRowClick} onRowCheck={onRowCheck} />)
    ));
  }
  return (
    <tbody className="fw-table__body">
      {content}
    </tbody>
  )
});

export const DraggableTableBody = DragDropContext(HTML5Backend)(observer(({ data, config, onRowMove, onChangeItemOrderPosition, rowClassFn, keyFn, loading }) => {
  let content;
  if (!!loading) {
    content = (<tr><td colSpan={config.length}><Preloader id="table-preloader" /></td></tr>);
  } else {
    content = data.map((item, index) => (
      (<DraggableTableRow key={keyFn ? keyFn(item) : item.id}
        index={index} config={config} item={item}
        onRowMove={onRowMove} rowClassFn={rowClassFn}
        onChangeItemOrderPosition={onChangeItemOrderPosition} />)
    ));
  }
  return (
    <tbody className="fw-table__body fw-table__body--draggable">
      {content}
    </tbody>
  );
}));
