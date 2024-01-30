import React, { Component, Fragment } from "react";
import classnames from "classnames";
import { NotificationsCenterContext } from "Context/NotificationsCenter";
import API from "Helpers/api";
import { updateItem, removeItemById } from "Helpers/array";
import { getClientType } from "Helpers/cookie";

export default class IncidentNotification extends Component {
  static contextType = NotificationsCenterContext;

  handleClick = () => {
    if (!this.props.processed) {
      this.props.onClick(this.props.id);
    }
  };

  get className() {
    return classnames("notification-center-list-item", {
      "notification-center-list-item--active": !this.props.processed,
      "notification-center-list-item--dialog": !!this.props.modalContent,
      "disabled_element": ['fc'].includes(getClientType())
    });
  }

  get logoClass() {
    return classnames("notification-center-list-item__logo", {
      "notification-center-list-item__logo--not-seen": !this.props.processed,
    });
  }

  get logo() {
    return (
      <div className={this.logoClass}>
        <i className={this.logoIconClass}></i>
      </div>
    );
  }

  get dropdownContent() {
    return (
      <Fragment>
        <span className="text-content">{this.content}</span>
        <small className="notification-center-list-item-body__date">
          {this.props.ago} ago
        </small>
      </Fragment>
    );
  }

  get modalContent() {
    return (
      <Fragment>
        <div className="notification-center-list-item-body__date notification-center-list-item-body__date--dialog">
          {this.props.created_at}
        </div>
        <span className="text-content">{this.content}</span>
      </Fragment>
    );
  }

  deleteNotification = (event) => {
    let { url, notifications } = this.context;
    let { id, onChange } = this.props;

    url = `${url}/clear_notifications?id=${id}`;

    API.delete(url).then((e) => {
      if (this.props.isModal) {
        onChange(removeItemById(this.props.isModal.notifications, id));
      } else {
        onChange(removeItemById(notifications, id));
      }
      event.stopPropagation();
    });
  };

  render() {
    const { modalContent } = this.props;
    return (
      <li className={this.className} onClick={this.handleClick}>
        {this.logo}
        <div className="notification-center-list-item__body">
          {!!modalContent ? this.modalContent : this.dropdownContent}
        </div>
        <span style={{ marginLeft: "auto" }}>
          <svg
            onClick={this.deleteNotification.bind(this)}
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
