import React, { useContext, cloneElement } from 'react';
import classnames from 'classnames';
import { NotificationsCenterContext } from 'Context/NotificationsCenter';
import * as Notifications from './Notifications';
import { updateItem } from 'Helpers/array';
import API from 'Helpers/api';

const NotificationsList = ({ className, notifications, onChange, modalContent }) => {
  const { url } = useContext(NotificationsCenterContext);

  function handleChange(id) {
    API.put(`${url}/${id}`, {
      body: {
        notification: {
          processed: true,
        },
      }
    });
    onChange(updateItem(notifications, id, { processed: true }));
  }

  const notificationsList = notifications
    .filter(({ notificationable_type }) => !!Notifications[notificationable_type])
    .map(notification => {
      const Notification = Notifications[notification.notificationable_type];
      return (
        <Notification key={notification.id} {...notification}
          modalContent={modalContent} onClick={handleChange} />
      );
    });

  return (
    <ul className={classnames('notification-center-list', className)}>
      {notificationsList}
    </ul>
  );
}

export default NotificationsList;
