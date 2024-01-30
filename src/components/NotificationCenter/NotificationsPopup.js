import React, { Component, Fragment } from "react";
import NotificationsList from "./NotificationsList";
import AlertsList from "./AlertsList";
import { getClientType } from "Helpers/cookie";


export default class NotificationsPopup extends Component {
  state = {
    isOpen: false,
    isNotificationsTab: true,
  };

  open = () => this.setState({ ...this.state, isOpen: true });
  close = () => this.setState({ ...this.state, isOpen: false });

  showAlertsTab = () => {
    if (this.state.isNotificationsTab) {
      this.setState({
        ...this.state,
        isNotificationsTab: false,
      });
    }
  };

  showNotificationsTab = () => {
    if (!this.state.isNotificationsTab) {
      this.setState({
        ...this.state,
        isNotificationsTab: true,
      });
    }
  };

  render() {
    const { isOpen, isNotificationsTab } = this.state;
    const { notifications, onAllClick, onChange, alerts, onAllAlertsClick } =
      this.props;
    if (!isOpen) {
      return null;
    }

    return (
      <Fragment>
        <div
          className="notification-center__dropdown-overlay"
          onClick={this.close}
        ></div>
        <div className="notification-center__dropdown notification-center-dropdown">
          <div
            className={`notification-center-dropdown__title notification-center-dropdown-title ${
              isNotificationsTab
                ? ""
                : "notification-center-dropdown__inactive-tab"
            }`}
            onClick={this.showNotificationsTab}
          >
            Notifications
            <span className="notification-center-dropdown-title__badge">
              {notifications.length}
            </span>
          </div>
          <div
            className={`notification-center-dropdown__title notification-center-dropdown-title ${
              isNotificationsTab
                ? "notification-center-dropdown__inactive-tab"
                : ""
            }`}
            onClick={this.showAlertsTab}
          >
            Alerts
            <span className="notification-center-dropdown-title__badge">
              {alerts.length}
            </span>
          </div>
          {isNotificationsTab ? (
            <Fragment>
              <div className="notification-center-dropdown__list-container">
                {notifications && notifications.length > 0 ? (
                  <NotificationsList
                    notifications={notifications}
                    className="notification-center-dropdown__list"
                    onChange={onChange}
                  />
                ) : (
                  <div className="notification-center-dropdown__list-no-item">
                    <p>There are no notifications at this time.</p>
                  </div>
                )}
              </div>

              {notifications && notifications.length > 0 && (
                <button
                  className={`notification-center-dropdown__footer ${['fc'].includes(getClientType()) ? 'disabled_element': '' }`}
                  onClick={onAllClick}
                >
                  View all notifications
                </button>
              )}
            </Fragment>
          ) : (
            <Fragment>
              <div className="notification-center-dropdown__list-container">
                {alerts && alerts.length > 0 ? (
                  <AlertsList
                    alerts={alerts.length <= 5 ? alerts : alerts.slice(0, 5)}
                    className="notification-center-dropdown__list"
                    changeAlerts={this.props.changeAlerts}
                    alerts={this.props.alerts}
                  />
                ) : (
                  <div className="notification-center-dropdown__list-no-item">
                    <p>There are no alerts at this time.</p>
                  </div>
                )}
              </div>
              {alerts && alerts.length > 0 && (
                <button
                  className="notification-center-dropdown__footer"
                  onClick={onAllAlertsClick}
                >
                  View all alerts
                </button>
              )}
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  }
}
