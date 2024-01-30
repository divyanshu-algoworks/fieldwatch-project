import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { autobind } from 'core-decorators';
import classnames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import TableCell from '../Table/TableCell';
import { TABLE_ROW } from '../../constants/ItemTypes';
import Input from '../Input';
import { getClientType } from '../../helpers/cookie'

@observer
export class TableRow extends Component {

  componentDidUpdate() {
    const { height } = this.row.getBoundingClientRect();
    if (!!this.fixedCell) {
      this.fixedCell.td.height = height;
    }
  }

  @autobind handleRowClick(e) {
    const { item, onClick } = this.props;
    if(!e.target.classList.contains('icon') && !!onClick) {
      onClick(item);
    }
  }

  render() {
    const { item, config, empty, rowClassFn, onRowCheck } = this.props;
    const client_type =  getClientType()
    
    return (
      <tr className={classnames('fw-table__row', !!rowClassFn && rowClassFn(item), {
        'fw-table__row--empty': empty
      })}
        ref={tr => this.row = tr}
        onClick={this.handleRowClick}>
        {empty ? (<TableCell className="fw-table__cell--empty" colSpan={config.length}>No records</TableCell>) : [
          !!onRowCheck && [(
            <TableCell key="check" className="fw-table__cell--fixed fw-table__cell--check"
              ref={td => this.fixedCell = td}>
              <label onClick={(e) => e.stopPropagation()}>
                {item.checkable ? (<Input type="checkbox" size="small"
               disabled={client_type && ['fc'].includes(client_type)}
                  checked={item.checked}
                  onChange={(e) => { onRowCheck(item, e.target.checked) }} />) : <div></div>}
              </label>
            </TableCell>
          ), (
            <td key="back" style={{ minWidth: '31px' }}></td>
          )],
          config.map(col => (
            <TableCell key={col.accessor || col.title} item={item} column={col}
              config={config} />
          ))
        ]}
      </tr>
    );
  }
}

const rowSource = {
  beginDrag(props, monitor, component) {
    return {
      id: props.item.id,
      index: props.index
    };
  },

  endDrag(props, monitor, component) {
    const { item, index, onChangeItemOrderPosition } = props;
    const fromPosition = item.order_position;
    const toPosition = index + 1;
    onChangeItemOrderPosition(item.id, fromPosition, toPosition);
  }
};

const rowTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.onRowMove(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

function collectDragSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};

function collectDropTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

@DropTarget(TABLE_ROW, rowTarget, collectDropTarget)
@DragSource(TABLE_ROW, rowSource, collectDragSource)
export class DraggableTableRow extends Component {
  static propTypes = {
    // Injected by React DnD:
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };
  render() {
    const { isDragging, connectDragSource, connectDropTarget, item, config, rowClassFn } = this.props;
    return connectDragSource(connectDropTarget(
      <tr className={classnames('fw-table__row fw-table__row--draggable', !!rowClassFn && rowClassFn(item))}
        style={{ opacity: isDragging ? 0 : 1 }}>
        {config.map(col => (
          <TableCell key={col.accessor || col.title} item={item} column={col}
            config={config} />
        ))}
      </tr>
    ));
  }
}
