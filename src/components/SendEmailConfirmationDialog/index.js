import React, { Component } from "react";
import classnames from "classnames";
import Button from "Components/Button";
import Dialog from "Components/Dialog";

export default class SendEmailConfirmationDialog extends Component {
  get dialogHeader() {
    const { header, title } = this.props;
    if (!!header) {
      return header;
    }

    return (
      <div>
        <span className="filter-dialog__title">{title}</span>
      </div>
    );
  }

  get dialogBody() {
    const {
      can_send_warning_email,
      remediationIncidentData,
      isAllRemediation,
      count,
    } = this.props;
    if (isAllRemediation) {
      return <div className="warning">Remediation is disabled</div>;
    }

    if (can_send_warning_email) {
      return (
        <div>
          <h5>
            This action can not be completed as remediation is disabled for-
          </h5>
          <p>
            <b>Rep Rank: </b>
            {remediationIncidentData.rep_rank_data}
          </p>
          <p>
            <b>Rep Country: </b>
            {remediationIncidentData.rep_country_data}
          </p>
          {remediationIncidentData.hasOwnProperty('territory_data') && (
             <p>
             <b>Territory: </b>
             {remediationIncidentData.territory_data}
           </p>
          )}
        </div>
      );
    }
    return (
      <p>
        You are about to send email to{" "}
        <span style={{ color: "#ed8800" }}>{count}</span> recipients. Are you
        sure?
      </p>
    );
  }

  render() {
    const {
      count,
      isOpen,
      onClose,
      onSuccess,
      className,
      can_send_warning_email,
      remediationIncidentData,
      isAllRemediation,
    } = this.props;
    return (
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        className={classnames("filter-dialog", className)}
      >
        <Dialog.Header onClose={onClose}>{this.dialogHeader}</Dialog.Header>
        <Dialog.Body>{this.dialogBody}</Dialog.Body>
        <Dialog.Footer>
          {can_send_warning_email ? (
            <Button status="orange" onClick={onClose}>
              Okay
            </Button>
          ) : (
            <div>
              <Button status="black" onClick={() => onClose()} default>
                Cancel
              </Button>
              <Button onClick={() => onSuccess()}>Send</Button>
            </div>
          )}
        </Dialog.Footer>
      </Dialog>
    );
  }
}
