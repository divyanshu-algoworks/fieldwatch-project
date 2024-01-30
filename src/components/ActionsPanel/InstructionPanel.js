import React, { Fragment, createRef } from "react";
import Common from "./Common";

export class InstructionActionsPanel extends Common {
  state = {
    isModelOpen: false,
    instructionBox: true,
    expanded: this.props.isOpen
  };
  title = "Instructions";

  get actionsList() {
    const { text } = this.props;
    return (
      <Fragment>
        <div
          className="ql-editor"
          style={{ color: "#c3c3c3", padding: "0" }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Fragment>
    );
  }

  get dialogs() {
    return (
      <Fragment>
        <div></div>
      </Fragment>
    );
  }
}
