import React, { Component, createRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Dialog from 'Components/Dialog';
import Button from 'Components/Button';
import Preloader from 'Components/Preloader';
import Checkbox from 'Components/Input/Checkbox';
import { NotificationsCenterContext } from 'Context/NotificationsCenter';
import NotificationsList from './NotificationsList';
import API from 'Helpers/api';

export default class NotificationsDialog extends Component {
  static contextType = NotificationsCenterContext;
  dialogBody = createRef();
  state = {
    isOpen: false,
    notifications: [],
    hasMore: true,
    unreadOnly: false,
  };
  sortColumn = 'created_at';
  sortDirection = 'desc';
  sizePerPage = 15;

  fetchData = (page) => {
    const { url } = this.context;
    return API.get(url, {
      body: {
        sort_column: this.sortColumn,
        sort_direction: this.sortDirection,
        size_per_page: this.sizePerPage,
        page,
      }
    }).then(({ data, recordsTotal }) => {
      const notifications = [...this.state.notifications, ...data];
      this.setState({
        notifications,
        hasMore: recordsTotal > notifications.length,
      });
    })
  }

  readAll = () => {
    const { url } = this.context;
    this.setState({ loading: true });
    API.post(`${url}/mark_all_as_read`).then(({ data }) => {
      this.setState({ loading: false });
      const notifications = this.state.notifications.map(notification => {
        return { ...notification, processed: true, };
      });
      this.setState({ notifications });
    })
  }

  open = () => {
    this.setState({ isOpen: true });
  }
  close = () => this.setState({ isOpen: false });
  setUnreadOnly = ({ target }) => this.setState({ unreadOnly: target.checked });
  changeNotifications = (notifications) => this.setState({ notifications });

  get notificationsToDisplay() {
    const { notifications, unreadOnly } = this.state;
    if (!!unreadOnly) {
      return notifications.filter(({ processed }) => !processed);
    }
    return notifications;
  }

  render() {
    const { isOpen, hasMore, unreadOnly, loading, } = this.state;
    return (
      <Dialog isOpen={isOpen} onClose={this.close}>
        <Dialog.Header onClose={this.close}>Notifications</Dialog.Header>
        <Dialog.Body ref={this.dialogBody} style={{ overflow: 'hidden', position: 'relative' }}>
          <div className="d-f mb-15">
            <Button size="small" className="mr-10" onClick={this.readAll}>
              Read All
            </Button>
            <div>
              <Checkbox label="Unread Only" checked={unreadOnly}
                onChange={this.setUnreadOnly} />
            </div>
          </div>
          {!!loading && (<Preloader fixed />)}
          <div className="notifications-dialog-list-container">
            <InfiniteScroll
              pageStart={0}
              loadMore={this.fetchData}
              hasMore={hasMore}
              useWindow={false}
              loader={<Preloader key={0} />}>
              <NotificationsList modalContent={true}
                notifications={this.notificationsToDisplay}
                onChange={this.changeNotifications} />
            </InfiniteScroll>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button status="white" onClick={this.close}>Close</Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
