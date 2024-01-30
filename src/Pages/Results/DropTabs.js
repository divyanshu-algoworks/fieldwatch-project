import React from 'react';
import { createPortal, } from 'react-dom';
import classnames from 'classnames';
import { DropTarget, } from 'react-dnd';
import { HIT_RESULT, } from '../../constants/ItemTypes';


const tabTarget = {
  drop({tab, onStateChange}) {
    onStateChange(tab.id)
  }
};

function collectDropTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    initialOffset: monitor.getInitialClientOffset(),
    didDrop: monitor.didDrop()
  }
}

const dropTagComponent = ({tab, isOver, connectDropTarget}) => {
  const itemClassNames = classnames('results-drop-tabs__list-item', {
    'results-drop-tabs__list-item--active': isOver,
  });

  return connectDropTarget(
  <li key={tab.id || tab.name} className={itemClassNames}>
    {tab.name}
  </li>
  )
}

const DropTag = DropTarget(HIT_RESULT, tabTarget, collectDropTarget)(dropTagComponent);

const dropTags = ({ tabs, onStateChange, initialOffset }) => {
  if(!initialOffset) {
    return null;
  }
  const container = document.getElementById('portal-container');
  return createPortal((
    <div className="results-drop-tabs">
      <div className="container">
        <ul className="results-drop-tabs__list">
          {tabs.map((tab) => (
            <DropTag tab={tab} key={tab.id} onStateChange={onStateChange} />
          ))}
        </ul>
      </div>
    </div>
  ), container);
};

export default DropTarget(HIT_RESULT, {}, collectDropTarget)(dropTags);
