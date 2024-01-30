import React, { Component } from "react";
import pluralize from "pluralize";
import Dialog from "Components/Dialog";
import Input from "Components/Input";
import Button from "Components/Button";
import Preloader from "Components/Preloader";
import Tooltip from "Components/Tooltip";
import API from "Helpers/api";

export default class BulkIncidentUpdate extends Component {
  state = {
    open: false,
    loading: false,
    options: [],
    selectedOption: null,
    allOptions: [],
    propName: "",
    openPreview: false,
  };

  open = (method, propName) => {
    const { incidentPropsUrl } = this.props;
    this.setState({ loading: true, isOpen: true, propName, method });
    API.get(incidentPropsUrl, { body: { method } }).then((data) => {
      this.setState({
        options: data.all_entities,
        allOptions: this.setOptionsForEntities(data.all_entities),
        loading: false,
      });
    });
  };

  getEdgeCaseOption = () => {
    return  [
      {
        id: 1,
        name: "true",
      },
      {
        id: 2,
        name: "false",
      },
    ];
  }


  capitalizeFirstLetter = (str) =>  {
    return str[0].toUpperCase() + str.slice(1);
  }

  setOptionsForEntities = (all_entities) => {
    return all_entities.map((item, index) => {
      const isArray = ["policies", "tags"].includes(item.method);
      const isUnderScore = item.method.includes("_");
      return {
        ...item,
        id: index + 1,
        name: `Change ${
          isUnderScore
            ? this.capitalizeFirstLetter(item.method.split("_").join(" "))
            : this.capitalizeFirstLetter(item.method)
        }`,
        isOpen: false,
        [`${item.method}_id`]: isArray ? [] : null,
        selectedOption: [],
        options:
          item.method === "edge_cases" ? this.getEdgeCaseOption() : [...item.options],
      };
    });
  };

  openSelectedEntity = (id) => {
    const all_entities = [...this.state.allOptions];
    const data = all_entities.map((item) => {
      return {
        ...item,
        isOpen: item.id === id ? !item.isOpen : false,
      };
    });
    this.setState({ allOptions: data });
  };

  close = () => this.setState({ isOpen: false });

  openPreviewScreen = () => this.setState({ openPreview: true });
  findEntityByIndex = (id) => {
    return this.state.allOptions.findIndex((item) => item.id === id);
  };

  handleChangeOption = (target, id, method_id) => {
    const { value } = target;
    const all_entities = [...this.state.allOptions];
    const index = this.findEntityByIndex(id);
    all_entities[index][method_id] = +value;
    all_entities[index].selectedOption = [+value];
    this.setState({ allOptions: all_entities });
  };

  handleChangeCheckboxOption = (target, id, method_id) => {
    const { checked } = target;
    const all_entities = [...this.state.allOptions];
    const optionIndex = this.findEntityByIndex(id);
    if (checked) {
      const selectedOptionIds = all_entities[optionIndex][method_id];
      const selectedIds = all_entities[optionIndex].selectedOption;
      all_entities[optionIndex][method_id] = [...new Set([...selectedOptionIds, +target.id])] //.push(+target.id);
      all_entities[optionIndex].selectedOption = [...new Set([...selectedIds, +target.id])]
    } else {
      const selectedNewOptions = all_entities[optionIndex][method_id].filter(
        (id) => id !== +target.id
      );
      all_entities[optionIndex][method_id] = selectedNewOptions;
      all_entities[optionIndex].selectedOption = selectedNewOptions;
    }
    this.setState({ allOptions: all_entities });
  };

  getOptionsById = (optionId, id) => {
    const all_entities = [...this.state.allOptions];
    const optionIndex = this.findEntityByIndex(id);
    return all_entities[optionIndex].options.find((x) => x.id === optionId).name;
  };

  filterAllOptions = (all_options) => {
    return all_options
      .filter((x) => x.selectedOption.length > 0)
      .map(({ method, selectedOption, ...item }) => {
        return {
          method,
          [`${method}_id`]: item[`${method}_id`],
        };
      });
  };

  handleApply = () => {
    const { allOptions, method } = this.state;
    const { additionEmailProps } = this.props;

    this.setState({ loading: true });
    const body = {
      method,
      all_methods_data: this.filterAllOptions(allOptions),
      ...additionEmailProps,
    };
    API.put(this.props.updateIncidentsPropUrl, { body }).then((res) => {
      this.close();
      this.props.onSuccessApply(res);
    });
  };

  render() {
    const { count } = this.props;
    const { isOpen, loading, propName, allOptions, openPreview } = this.state;
    return (
      <Dialog isOpen={isOpen} onClose={this.close}>
        <Dialog.Header onClose= {() => {this.close(), this.setState({ openPreview: false })}}>
          Bulk Edit {openPreview && "Summary"} for &nbsp;
          <span className="c-orange">{pluralize("Incident", count, true)}</span>
        </Dialog.Header>
        <Dialog.Body>
          <div>
          <div className="grid">
            <div className="grid__row">
              {!!loading && (
                <div className="grid__col grid__col--12">
                  <Preloader />
                </div>
              )}
              {openPreview &&
                !loading &&
                allOptions.map(({ name, id, selectedOption }) => {
                  return (
                    <div className="grid">
                      <div
                        className="grid__row preview preview-bulk"
                      >
                        <div
                          style={{ fontWeight: "600" }}
                          className="grid__col grid__col--3.5 preview__label"
                        >
                          {name}:
                        </div>
                        <div className="grid__col grid__col--8 preview__value">
                          {selectedOption.length == 0 ? 
                          <span>No change</span>
                          :
                          selectedOption.map((optionId, i) => {
                            return (
                              <span className="c-orange">
                                {this.getOptionsById(optionId, id)}
                                {i + 1 !== selectedOption.length ? ", " : ""}
                              </span>
                            );
                          })
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              {!loading && !allOptions.length && (
                <b>No {pluralize(propName)}</b>
              )}
              {!loading &&
                !openPreview &&
                allOptions.map(
                  (
                    {
                      name,
                      isOpen,
                      options,
                      method,
                      selectedOption,
                      id,
                    },
                    i
                  ) => (
                    <React.Fragment>
                      <div
                        className="bulk-incident-view"
                        key={i}
                      >
                        <p className="cursor-pointer" onClick={() => this.openSelectedEntity(id)}>{name}</p>
                        <span
                          style={{ fontSize: "22px" }}
                          className={`icon fa ${
                            isOpen ? "fa-angle-up" : "fa-angle-down"
                          }`}
                          onClick={() => this.openSelectedEntity(id)}
                        />
                      </div>
                      <div className="grid">
                        <div className="grid__row">
                          {!loading &&
                            isOpen &&
                            options.map((option, i) => (
                              <div
                                className="grid__col grid__col--4 mb-10"
                                key={i}
                              >
                                <Input
                                  type={["policies", "tags"].includes(method) ? "checkbox" : "radio"}
                                  value={option.id}
                                  id={option.id}
                                  label={option.name}
                                  labelClassName="ellipsis"
                                  onChange={({ target }) =>
                                    ["policies", "tags"].includes(method)
                                      ? this.handleChangeCheckboxOption(target, id, `${method}_id`)
                                      : this.handleChangeOption(target, id, `${method}_id`)
                                  }
                                  checked={selectedOption.includes(option.id)}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                      {allOptions.length !== i+1 && <hr />}
                    </React.Fragment>
                  )
                )}
            </div>
          </div>
          </div>
        </Dialog.Body>
        <Dialog.Footer>
          {openPreview ? (
            <div>
              <Button
                status="black"
                onClick={() => this.setState({ openPreview: false })}
              >
                Edit
              </Button>
              <Button onClick={this.handleApply}>Apply</Button>
            </div>
          ) : (
            <div>
              <Button status="black" onClick={this.close}>
                Close
              </Button>
              <Button onClick={this.openPreviewScreen}>Continue</Button>
            </div>
          )}
        </Dialog.Footer>
      </Dialog>
    );
  }
}
