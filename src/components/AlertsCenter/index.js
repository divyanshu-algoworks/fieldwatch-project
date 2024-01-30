import React, { Component, createRef } from 'react';
import { NotificationsCenterProvider } from 'Context/NotificationsCenter';
import NotificationsPopup from './NotificationsPopup';
import NotificationsDialog from './NotificationsDialog';

export default class AlertsCenter extends Component {
  dialog = createRef();
  dropdown = createRef();
  state = {
    notifications: this.props.notifications,
  };

  openDialog = () => {
    this.dialog.current.open();
    this.dropdown.current.close();
  }
  showDropDown = () => this.dropdown.current.open();
  changeNotifications = (notifications) => this.setState({ notifications });

  get hasNewMessages() {
    return this.state.notifications.some(({ processed }) => !processed);
  }

  render() {
    const { notifications } = this.state;
    const { url, incidents_url, representatives_url } = this.props;
    return (
      <span className="notification-center">
        <NotificationsCenterProvider value={{ notifications, url, incidents_url, representatives_url }}>
          <button className="notification-center__dropdown-trigger notification-center-dropdown-trigger"
            onClick={this.showDropDown}>
            <i className="notification-center-dropdown-trigger__icon icon s7-attention alerts_notification"></i>
            {!!this.hasNewMessages && (<i className="notification-center-dropdown-trigger__new-icon"></i>)}
          </button>
          <NotificationsPopup ref={this.dropdown} notifications={notifications}
            onAllClick={this.openDialog} onChange={this.changeNotifications} />
          <NotificationsDialog ref={this.dialog} />
        </NotificationsCenterProvider>
      </span>
    );
  }
}
