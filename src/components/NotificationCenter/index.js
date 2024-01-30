import React, { Component, createRef } from "react";
import { NotificationsCenterProvider } from "Context/NotificationsCenter";
import NotificationsPopup from "./NotificationsPopup";
import NotificationsDialog from "./NotificationsDialog";
import AlertsDialog from "./AlertsDialog";

export default class NotificationCenter extends Component {
  dialog = createRef();
  dropdown = createRef();
  alertsDialog = createRef();
  state = {
    notifications: this.props.notifications,
    alerts: this.props.alerts,
  };

  openDialog = () => {
    this.dialog.current.open();
    this.dropdown.current.close();
  };

  openAlertsDialog = () => {
    this.alertsDialog.current.open();
    this.dropdown.current.close();
  };

  showDropDown = () => this.dropdown.current.open();
  changeNotifications = (notifications) => this.setState({ notifications });

  changeAlerts = (alerts) => this.setState({ alerts });

  get hasNewMessages() {
    return this.state.notifications.some(({ processed }) => !processed);
  }

  render() {
    const { notifications, alerts } = this.state;

    const { url, incidents_url, representatives_url } = this.props;
    return (
      <div className="notification-center">
        <NotificationsCenterProvider
          value={{
            notifications,
            url,
            incidents_url,
            representatives_url,
            alerts,
          }}
        >
          <button
            className="notification-center__dropdown-trigger notification-center-dropdown-trigger"
            onClick={this.showDropDown}
          >
            <i className="notification-center-dropdown-trigger__icon icon s7-bell"></i>
            {!!this.hasNewMessages && (
              <i className="notification-center-dropdown-trigger__new-icon"></i>
            )}
          </button>
          <NotificationsPopup
            ref={this.dropdown}
            notifications={notifications}
            onAllClick={this.openDialog}
            onChange={this.changeNotifications}
            alerts={alerts}
            changeAlerts={this.changeAlerts}
            onAllAlertsClick={this.openAlertsDialog}
          />
          <NotificationsDialog
            ref={this.dialog}
            onChange={this.changeNotifications}
            alerts={alerts}
            changeAlerts={this.changeAlerts}
          />
          <AlertsDialog
            ref={this.alertsDialog}
            alerts={alerts}
            stateFunc={this.setState}
            changeAlerts={this.changeAlerts}
          />
        </NotificationsCenterProvider>
      </div>
    );
  }
}
