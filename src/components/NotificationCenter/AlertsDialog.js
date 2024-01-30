import React, { Component, createRef } from "react";
import Dialog from "Components/Dialog";
import Button from "Components/Button";
import AlertsList from "./AlertsList";
import { NotificationsCenterContext } from "Context/NotificationsCenter";
import API from "Helpers/api";
import { removeAll, removeDuplicates } from "Helpers/array";

export default class AlertsDialog extends Component {
  static contextType = NotificationsCenterContext;
  dialogBody = createRef();
  state = {
    isOpen: false,
    alerts: removeDuplicates(this.props.alerts, "id"),
  };

  open = () => {
    this.setState({ isOpen: true });
  };

  close = () => this.setState({ isOpen: false });

  deleteAlertAll = (e) => {
    let { url, notifications } = this.context;
    // this.setState({ loading: true });
    url = `${url}/clear_alerts?clear_all=1`;

    API.delete(`${url}`).then((res) => {
      // this.setState({ loading: false });
      // this.props.onChange(removeAll(this.state.notifications));
      this.setState((prevState) => {
        removeAll(this.state.alerts);
        removeAll(prevState.alerts);
        removeAll(this.props.alerts);

        return { ...prevState };
      });
    });
  };

  render() {
    const { isOpen, alerts } = this.state;

    return (
      <Dialog isOpen={isOpen} onClose={this.close}>
        <Dialog.Header onClose={this.close}>
          Alerts
          <Button
            style={{ position: "relative", left: "41rem", bottom: "0.5rem" }}
            size="small"
            className="mr-10"
            onClick={this.deleteAlertAll.bind(this)}
          >
            Clear All
          </Button>
        </Dialog.Header>

        <Dialog.Body
          ref={this.dialogBody}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <div
            className="notification-center-dropdown__list-container"
            style={{ overflow: "auto" }}
          >
            <AlertsList
              changeAlerts={this.changeAlerts}
              isModal={true}
              stateFunc={this.setState.bind(this)}
              alerts={alerts}
              className=""
            />
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          <Button status="white" onClick={this.close}>
            Close
          </Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
