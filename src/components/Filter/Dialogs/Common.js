import React, { Component } from "react";
import classnames from "classnames";
import Button from "../../../components/Button";
import Dialog from "../../../components/Dialog";
import Switch from "react-switch";
export default class FilterDialog extends Component {
  static defaultProps = {
    bodyStyle: {},
  };
  toggleOptions = ["Creators", "Owners"];

  state = {
    isOpen: false,
    errorMessages: {},
    active: true,
  };

  defaultBodyStyle = {};

  open = (data) => this.setState({ data, isOpen: true });
  close = () => this.setState({ errorMessages: {}, isOpen: false });

  handleSearchData = (stateData, propsData) => {
    const finalData = [];
    propsData &&
      propsData.map((item) => {
        const filterData = stateData.filter((x) => x.id === item.id)[0];
        const obj = filterData
          ? {
              ...item,
              checked: filterData.checked,
            }
          : item;
        finalData.push(obj);
      });
    return finalData;
  };

  handleApplyFilter = () => {
    if (JSON.stringify(this.state.data) === JSON.stringify(this.props.data)) {
      return this.close();
    }
    let searchdata;
    if (
      this.props.label === "Policies" &&
      this.state.data.length !== this.props.data.length
    ) {
      searchdata = this.handleSearchData(this.state.data, this.props.data);
    }
    const isfilterValid = this.validator
      ? this.validator(this.state.data)
      : true;
    if (!!isfilterValid) {
      this.props.onChange(this.props.name, searchdata || this.state.data);
      this.close();
    }
  };

  get dialogHeader() {
    const { header, label } = this.props;
    const { active } = this.state;
    if (!!header) {
      return header;
    }

    return (
      <div>
        Filter by&nbsp;
        <span className="filter-dialog__title">
          {label}
          {label && label.includes("Claims Rules") && (
            <span className="beta-icon">BETA</span>
          )}
          {label && this.toggleOptions.includes(label) && (
            <React.Fragment>
              <label className="filter-dialog__title ml-25 ">
                {!!active ? "Active" : "Locked"}
              </label>
              <Switch
                onChange={(checked) => {
                  this.setState({ active: checked });
                }}
                checked={this.state.active}
                onColor="#86d3ff"
                onHandleColor="#2693e6"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={30}
                width={70}
                className="react-switch"
                id="material-switch"
              />
            </React.Fragment>
          )}
        </span>
      </div>
    );
  }

  get bodyStyle() {
    return {
      ...this.defaultBodyStyle,
      ...this.props.bodyStyle,
    };
  }

  render() {
    const { isOpen } = this.state;
    const { className } = this.props;

    return (
      <Dialog
        isOpen={isOpen}
        onClose={this.close}
        className={classnames("filter-dialog", className)}
      >
        <Dialog.Header onClose={this.close}>{this.dialogHeader}</Dialog.Header>
        <Dialog.Body style={this.bodyStyle}>{this.dialogBody}</Dialog.Body>
        <Dialog.Footer>
          <Button status="white" onClick={this.close}>
            Close
          </Button>
          <Button onClick={this.handleApplyFilter}>Apply</Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
