import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Button from "../../components/Button";

export default class CommonActionsPanel extends Component {
  title = "Actions";
  static propTypes = {
    count: PropTypes.number,
  };

  static defaultProps = {
    count: 0,
  };

  state = {
    expanded: true,
    isChangeDialogOpen: false,
    isSendEmailDialogOpen: false,
    propName: null,
    method: null,
  };

  toggleExpanded = () => this.setState({ expanded: !this.state.expanded });

  render() {
    const { expanded, instructionBox } = this.state;
    const { count } = this.props;
    let style;
    if (instructionBox) {
      style = {
        "actions-panel--wide": !!this.wide,
        "actions-panel--hidden": count,
        "actions-panel--expanded": expanded,
        "actions-panel--collapsed": !expanded,
      };
    } else {
      style = {
        "actions-panel--wide": !!this.wide,
        "actions-panel--hidden": !count,
        "actions-panel--expanded": !!count && expanded,
        "actions-panel--collapsed": !!count && !expanded,
      };
    }
    return (
      <Fragment>
        <div className={classnames("actions-panel", style)}>
          <div className="actions-panel__title">
            {this.title} {!instructionBox && `(${count})`}
          </div>
          <Button
            className={`actions-panel__button actions-panel__button--expander ${
              instructionBox && "instruction-pannel-btn"
            }`}
            onClick={this.toggleExpanded}
          >
            <i
              className={classnames(
                "icon",
                "s7-angle-right",
                "actions-panel__expander-icon",
                { "actions-panel__expander-icon--rotated": !expanded }
              )}
            ></i>
          </Button>
          <div className="actions-panel__actions instruction-pannel">
            {this.actionsList}
          </div>
          {this.summary}
        </div>
        {this.confirmationDialog}
        {this.dialogs}
      </Fragment>
    );
  }
}
