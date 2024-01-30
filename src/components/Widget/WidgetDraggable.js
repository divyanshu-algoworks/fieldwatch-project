import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import { WIDGET } from 'Constants/ItemTypes';
import Button from 'Components/Button';
import Tooltip from 'Components/Tooltip';

const rowSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.order_position
    };
  },

  endDrag(props) {
    const { id, order_position, index, onChangeItemOrderPosition } = props;
    const fromPosition = order_position;
    const toPosition = index + 1;
    onChangeItemOrderPosition(id, fromPosition, toPosition);
  }
};

const rowTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.order_position;
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
    props.onRowMove(dragIndex - 1, hoverIndex - 1);

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


@DropTarget(WIDGET, rowTarget, collectDropTarget)
@DragSource(WIDGET, rowSource, collectDragSource)
export default class WidgetDraggable extends Component {
  render() {
    const { isDragging, connectDragSource, connectDropTarget, editUrl, onDestroy, onResize, ...widget } = this.props;
    const { name } = widget.widget;
    return connectDragSource(connectDropTarget(
      <div className="fw-widget fw-widget--draggable" style={{ opacity: isDragging ? 0 : 1 }}>
        <div className="fw-widget__header">
          <div className="fw-widget__name">
            <div className="ellipsis">{widget.order_position}.{name}</div>
          </div>
          <div className="fw-widget__header-buttons">
            {!!onResize && (
              <Tooltip body="Resize widget" className="mr-10">
                <Button status="link" onClick={() => onResize(widget)}>
                  <i className={classnames('icon', 'icon--bold', 'icon--button', {
                    'pe-7s-plus': widget.widget_size == '1',
                    'pe-7s-less': widget.widget_size == '2',
                  })}></i>
                </Button>
              </Tooltip>
            )}
            {!!onDestroy && (
              <Tooltip body="Unpin widget from dashboard" className="mr-10">
                <Button status="link" onClick={() => onDestroy(widget)}>
                  <i className="pe-7s-pin icon icon--bold icon--button c-blue"></i>
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    ));
  }
}

