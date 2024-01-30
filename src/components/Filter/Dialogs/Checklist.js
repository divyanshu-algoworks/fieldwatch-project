import React from "react";
import Button from "../../Button";
import Tooltip from "../../Tooltip";
import Checkbox from "../../Input/Checkbox";
import { updateItem } from "../../../helpers/array";
import Common from "./Common";
import Preloader from "../../Preloader";

const FilterCheckbox = ({ label, item, onChange }) => {
  function handleChange({ target }) {
    onChange(item, target.checked);
  }

  return (
    <Tooltip body={label}>
      <Checkbox checked={item.checked} label={label} onChange={handleChange} />
    </Tooltip>
  );
};

export class Checklist extends Common {
  constructor(props) {
    super(props);
    this.state = {
      typingTimeout: 0,
      policy_search: "",
      checkedIds: props.data.map(({ id }) => id),
      loading: false,
      active: true,
    };
  }
  handleChangeCheckbox = (item, checked) => {
    const { data, checkedIds } = this.state;
    if (checked) this.setState({ checkedIds: [...checkedIds, item.id] });
    else
      this.setState({ checkedIds: checkedIds.filter((id) => id != item.id) });
    this.setState({ data: updateItem(data, item.id, { checked }) });
  };

  applyForAllCheckboxes = (checked) => {
    const { data } = this.state;
    this.setState({
      data: data.map((item) => {
        return { ...item, checked };
      }),
      checkedIds: checked ? data.map(({ id }) => id) : [],
    });
  };

  escapeRegExp = (str) => {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  };

  searchPolicy = async (policy) => {
    this.setState({ policy_search: policy }, () => {
      if (this.state.typingTimeout) {
        clearTimeout(this.state.typingTimeout);
      }
      this.setState({
        typingTimeout: setTimeout(() => {
          const escapedRegex = this.escapeRegExp(policy);
          const regExp = new RegExp(escapedRegex.toLowerCase());
          const itemsToDisplay =
            this.props.data &&
            this.props.data.filter(({ name }) =>
              regExp.test(name.toLowerCase())
            );
          const finalData = this.filterCheckUncheckFilter(
            itemsToDisplay,
            this.state.checkedIds
          );
          this.setState({ data: finalData });
        }, 500),
      });
    });
  };

  filterCheckUncheckFilter = (displayPolicy, checkedPolicy) => {
    const finalData = [];
    displayPolicy.map((item) => {
      const filterData = checkedPolicy.filter((id) => id === item.id)[0];
      const obj = {
        ...item,
        checked: filterData ? true : false,
      };
      finalData.push(obj);
    });
    return finalData;
  };

  checkAll = () => this.applyForAllCheckboxes(true);
  uncheckAll = () => this.applyForAllCheckboxes(false);

  get dialogBody() {
    const { data, active } = this.state;
    const { checkboxLabelFn, label } = this.props;
    if (!data) {
      return;
    }
    const sortedData =  label === 'Clients' ? data.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1) : data;
    return (
      <div className="grid">
        <div className="grid__row">
          <div className="grid__col grid__col--6">
            <Button size="small" onClick={this.checkAll}>
              Check All
            </Button>
            <Button size="small" onClick={this.uncheckAll}>
              Uncheck All
            </Button>
          </div>
          {this.props.label == "Policies" && (
            <div className="grid__col grid__col--6">
              <div className="search-input">
                <i className="search-input__icon pe-7s-search"></i>
                <input
                  type="search"
                  placeholder="Search Policy"
                  className="fw-input fw-input-search fw-input--search search-input__input"
                  onChange={({ target }) => this.searchPolicy(target.value)}
                />
                {data.length === 0 && (
                  <div
                    style={{ padding: "6px 12px", backgroundColor: "#aaaaaa" }}
                  >
                    No Results
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="grid__row">
          {!!this.state.loading && (
            <div className="grid__col grid__col--12">
              <Preloader />
            </div>
          )}
          {!this.state.loading &&
            sortedData.map((item) => {
              const label = checkboxLabelFn ? checkboxLabelFn(item) : item.name;
              if (item.hasOwnProperty("locked")) {
                return (
                  <div
                    style={active == !item.locked ? {} : { display: "none" }}
                    className="grid__col grid__col--4 filter-dialog__checkbox"
                    key={item.id}
                  >
                    <FilterCheckbox
                      label={label}
                      item={item}
                      onChange={this.handleChangeCheckbox}
                    />
                  </div>
                );
              } else {
                return (
                  <div
                    className="grid__col grid__col--4 filter-dialog__checkbox"
                    key={item.id}
                  >
                    <FilterCheckbox
                      label={label}
                      item={item}
                      onChange={this.handleChangeCheckbox}
                    />
                  </div>
                );
              }
            })}
        </div>
      </div>
    );
  }
}
