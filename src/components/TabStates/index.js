import React from 'react';
import PropTypes from 'prop-types';
import Preloader from 'Components/Preloader';
import TabState from './TabState';
import classnames from 'classnames';

const TabStates = ({ data, children, loading, size }) => {
  if (loading) {
    return (<Preloader />);
  }

  if(!!children) {
    return children;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="tab-states">
      <div className={classnames('tab-states__row', { 'tab-states__row--small': size })}>
        {data.map(item => (<TabState {...item} size={size} key={item.title} />))}
      </div>
    </div>
  );
};

TabStates.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    value: PropTypes.any,
  })),
  size: PropTypes.oneOf(['default', 'small'])
}

export default TabStates;
