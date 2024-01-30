import React, { Component } from "react";

import { NotificationsCenterContext } from "Context/NotificationsCenter";
import API from "Helpers/api";
import { updateItem, removeItemById } from "Helpers/array";

export default class Alert extends Component {
  static contextType = NotificationsCenterContext;

  deleteAlert = (event) => {
    let { url, notifications } = this.context;
    let { id, onChange } = this.props;

    url = `${url}/clear_alerts?id=${id}`;

    let { isModal, setAlertList, alerts } = this.props;

    API.delete(url)
      .then((e) => {
        if (isModal) {
          setAlertList((prevProps) => {
            let r = removeItemById(prevProps.alerts, id);

            return { ...prevProps, alerts: r };
          });
        } else {
          this.props.changeAlerts(removeItemById(alerts, id));
        }
      })
      .catch((err) => {
        console.log("error response", err);
      });
  };

  render() {
    const { text, title } = this.props;
    return (
      <li className="notification-center-list-item">
        <div className="notification-center-list-item__logo">
          <i className="icon s7-date"></i>
        </div>
        <div className="notification-center-list-item__body">
          <span className="text-content">{title}</span>
          <small
            className="notification-center__alert-text"
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          ></small>
        </div>

        <span style={{ marginLeft: "auto" }}>
          <svg
            onClick={this.deleteAlert.bind(this)}
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-x-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </span>
      </li>
    );
  }
}
