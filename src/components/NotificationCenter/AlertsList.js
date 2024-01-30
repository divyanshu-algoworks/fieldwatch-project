import React, { useState } from "react";
import classnames from "classnames";
import Alert from "./Alert";

const AlertsList = (props) => {
  let iterator = props.isModal ? props.alerts : props.alerts;

  const alertsList = iterator.map((alert) => {
    return (
      <Alert
        setAlertList={props.isModal ? props.stateFunc : props.stateFunc}
        changeAlerts={props.changeAlerts}
        alerts={props.isModal ? props.alerts : props.alerts}
        isModal={props.isModal}
        key={alert.id}
        id={alert.id}
        title={alert.title}
        text={alert.text}
      />
    );
  });

  return (
    <ul className={classnames("notification-center-list", props.className)}>
      {alertsList}
    </ul>
  );
};

export default AlertsList;
