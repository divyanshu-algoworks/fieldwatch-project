import React, { Component, Fragment } from 'react';
import NotificationsList from './NotificationsList';

export default class NotificationsPopup extends Component {
  state = {
    isOpen: false,
  }

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });
  render() {
    const { isOpen } = this.state;
    const { notifications, onAllClick, onChange } = this.props;
    if (!isOpen) {
      return null;
    }

    return (
      <Fragment>
        <div className="notification-center__dropdown-overlay" onClick={this.close}></div>
        <div className="notification-center__dropdown notification-center-dropdown">
          <div className="notification-center-dropdown__title notification-center-dropdown-title">
            Notifications
            <span className="notification-center-dropdown-title__badge">
              {notifications.length}
            </span>
          </div>
          <div className="notification-center-dropdown__list-container">
            <NotificationsList notifications={notifications}
              className="notification-center-dropdown__list" onChange={onChange} />
          </div>
          <button className="notification-center-dropdown__footer" onClick={onAllClick}>
            View all notifications
          </button>
        </div>
      </Fragment>
    );
  }
}
