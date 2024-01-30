import React, { Component } from "react";
import classnames from "classnames";
import Button from "Components/Button";
import Dialog from "Components/Dialog";

export default class InstructionDialogBox extends Component {
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

  render() {
    const { data, isOpen, onClose, text } = this.props;
    const className = "instruction-dialog";
    return (
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        className={classnames("filter-dialog", className)}
      >
        <Dialog.Header
          onClose={onClose}
          instructionStyle={{ marginLeft: "228px", padding: "10px" }}
        >
          {this.dialogHeader}
        </Dialog.Header>
        <Dialog.Body>
          <div
            dangerouslySetInnerHTML={{
              __html: text,
            }}
          />
        </Dialog.Body>
        <Dialog.Footer></Dialog.Footer>
      </Dialog>
    );
  }
}
