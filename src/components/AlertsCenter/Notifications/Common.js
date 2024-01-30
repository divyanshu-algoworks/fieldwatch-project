import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { NotificationsCenterContext } from 'Context/NotificationsCenter';

export default class IncidentNotification extends Component {
  static contextType = NotificationsCenterContext;

  handleClick = () => {
    if (!this.props.processed) {
      this.props.onClick(this.props.id);
    }
  }

  get className() {
    return classnames('notification-center-list-item', {
      'notification-center-list-item--active': !this.props.processed,
      'notification-center-list-item--dialog': !!this.props.modalContent,
    });
  }

  get logoClass() {
    return classnames('notification-center-list-item__logo', {
      'notification-center-list-item__logo--not-seen': !this.props.processed
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
        <span className="text-content">
          {this.content}
        </span>
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
        <span className="text-content">
          {this.content}
        </span>
      </Fragment>
    );
  }

  render() {
    const { modalContent, } = this.props;
    return (
      <li className={this.className}
        onClick={this.handleClick}>
        {this.logo}
        <div className="notification-center-list-item__body">
          {!!modalContent ? this.modalContent : this.dropdownContent}
        </div>
      </li>
    );
  }
};
