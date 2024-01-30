import React, { Component, useEffect } from 'react';
import Button from 'Components/Button';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const NOTIFICATION_LIFETIME = 2000;

function processMessage(msg) {
  const id = `f${(~~(Math.random()*1e8)).toString(16)}`;
  const title = msg.type[0].toUpperCase() + msg.type.slice(1);
  return {id, title, ...msg};
}

const FlashNotification = ({item, onClose}) => {
  let timer;
  function handleClose() {onClose(item)};
  function setTimer() {timer = setTimeout(handleClose, NOTIFICATION_LIFETIME)};
  function clearTimer() {clearTimeout(timer)};

  useEffect(() => {
    setTimer();
    return clearTimer;
  }, []);
  const handleMouseEnter = clearTimer;
  const handleMouseLeave = setTimer;


  return (
    <div className={classnames('flash-notification', `flash-notification--${item.type}`)}
      onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
      role="alert" onDoubleClick={handleClose}>
      <div className="flash-notification__header">
        <div className="flash-notification__title">{item.title}</div>
          <Button status="link" onClick={handleClose} className="flash-notification__close">
            <i className="pe-7s-close"></i>
          </Button>
      </div>
      <p className="flash-notification__body">
        {item.text}
      </p>
    </div>
  );
}

FlashNotification.propTypes = {
  onClose: PropTypes.func,
  item: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
  })
}

export default class FlashNotifications extends Component {

  constructor(props) {
    super(props);
    const notifications = (props.flash || []).map(processMessage);
    this.state = { notifications };
  }

  add = (notification) => {
    const notificationsToAdd = [].concat(notification).map(processMessage);
    const res = [].concat(this.state.notifications, notificationsToAdd);
    this.setState({notifications: res});
  };

  remove = ({id}) => {
    const { notifications } = this.state;
    const index = notifications.findIndex((item) => item.id === id);
    this.setState({
      notifications: [].concat(
        notifications.slice(0, index),
        notifications.slice(index + 1),
      )
    })
  }

  render() {
    const { notifications } = this.state;
    return (
      <div className="flash-notifications">
      <ReactCSSTransitionGroup
        transitionName="flash-notification"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}>
        {notifications.map(item => (
          <FlashNotification key={item.id} item={item} onClose={this.remove} />
        ))}
      </ReactCSSTransitionGroup>
      </div>
    );
  }
}
