import React, { Component } from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { autobind } from "core-decorators";
import classnames from "classnames";
import FormGroup from "Components/FormGroup";
import Tooltip from "Components/Tooltip";
import Select from "Components/Select";
import ExistRepresentativeTooltipBody from "Components/ExistRepresentativeTooltipBody";
import TagsSelect from "Components/TagsControls/TagsSelect";
import { LIFETIMERANKS, ALTERNATE_RANKS} from 'Constants/LifeTimeRanksIds';
import API from "Helpers/api";
import Button from "Components/Button";
import IconButton from "Components/IconButton";

const optionRenderer = ({
  option,
  isOptionSelected,
  isOptionFocused,
  getOptionLabel,
  getOptionValue,
  optionClassName,
  ...otherArgs
}) => {
  return (
    <div
      {...otherArgs}
      key={option.id}
      className={classnames("fw-select__option", optionClassName, {
        "fw-select__option--selected": isOptionSelected,
        "focused fw-select__option--focused": isOptionFocused,
      })}
    >
      {option.first_name}&nbsp;
      {option.last_name}&nbsp;
      {option.email} {(!!option.phone || !! option.alternate_phone) &&<br/>}
      {option.phone}&nbsp;
      {option.alternate_phone}
    </div>
  );
};
/**
 * RepresentativeGeneralInfo is component for edit main info about
 * representative. This form has autocomplete for first name, last name, id and
 * email fields. First name and last name is required fields.
 */

@observer
export default class RepresentativeGeneralInfo extends Component {
  static propTypes = {
    /** url for representative autocomplete requests */
    repAutocompletePath: PropTypes.string,
    sponsorAutoCompletePath: PropTypes.string,
  };
  state = {
    isRepIdFocused: false,
    webPresenceArray: [],
    selectedUrl: "",
    webPresenceEditMode: false,
    updatedItem: "",
    repEditMode: true,
    didWebPresenceUpdate: true,
    didReplicatedSiteUpdate: true,
    replicatedSite: "",
    didPropUpdate: false,
  };
  /**
   * Handler for change input with autocomplete if there will be
   * repAutocompletePath in component props. This function will change
   * representative prop and make ajax request for autocomplete options. When
   * request done, autocomplete options will be write to RepresentativeStore.
   * @param {string} key input value key
   * @param {string} value new input value
   */
  @autobind autocompletableInputChange(key, value) {
    const {
      changeValue,
      setAutocompleteOptions,
      setExistRepresentative,
      serializedItem,
    } = this.props.store.RepresentativeState;
    const { repAutocompletePath, checkExistRepIdUrl } = this.props;
    if (!!this.autocompleteRequest) {
      this.autocompleteRequest.abort();
    }
    changeValue(key, value);
    if (value.length < 3) {
      setAutocompleteOptions(null);
      this.handleClearExistRepresentative();
    } else {
      this.setState({ autocompletePending: true });
      this.autocompleteRequest = API.post(repAutocompletePath, {
        body: {
          representative: {
            ...serializedItem,
            [key]: value,
          },
        },
      });
      this.autocompleteRequest.then((autocompleteOptions) => {
        setAutocompleteOptions(autocompleteOptions);
        this.setState({ autocompletePending: false });
        this.autocompleteRequest = null;
      });
      if (key === "rep_id" && !!checkExistRepIdUrl) {
        this.checkRepIdRequest = API.get(checkExistRepIdUrl, {
          body: {
            key,
            value,
          },
        });
        this.checkRepIdRequest.then((res) => setExistRepresentative(res));
      }
    }
  }

  @autobind autocompletableSponsorId(key, value) {
    const {
      changeValue,
      setAutocompleteOptions,
      setExistRepresentative,
      serializedItem,
      updateSponsorEmail,
    } = this.props.store.RepresentativeState;

    const { sponsorAutocompletePath } = this.props;

    changeValue(key, value);

    if (value.length < 3) {
      setAutocompleteOptions(null);
      this.handleClearExistRepresentative();
    } else {
      this.setState({ autocompletePending: true });
      this.autocompleteRequest = API.post(sponsorAutocompletePath, {
        body: {
          representative: {
            ...serializedItem,
            [key]: value,
          },
        },
      });
      this.autocompleteRequest.then((autocompleteOptions) => {
        const { email, rep_id } = autocompleteOptions;
        updateSponsorEmail(email);
        this.setState({ autocompletePending: false });
        this.autocompleteRequest = null;
      });
    }
  }

  @autobind handleRepIdFocus() {
    this.setState({
      isRepIdFocused: true,
    });
  }
  @autobind handleRepIdBlur() {
    this.setState({
      isRepIdFocused: false,
    });
  }
  /**
   * If there is autocomplete request pending, then we should abort it.
   * @param {object} e event handler
   */
  @autobind handleAutocompleteKeydown({ target }) {
    if (this.autocompleteRequest) {
      this.autocompleteRequest.abort();
      this.setState({ autocompletePending: false });
      this.autocompleteRequest = null;
    }
    if (target === this.repIdInput && !!this.checkRepIdRequest) {
      this.checkRepIdRequest.abort();
      this.checkRepIdRequest = null;
    }
  }
  /**
   * When representative will be selected from autocomplete, then
   * @param {object} item representative data
   */
  handleAutocompleteSelect = ({ id }) => {
    API.get(`${this.props.representativesUrl}/${id}`).then(
      this.onGetRepresentative
    );
  };

  handleAddRepToState = (target) => {
    this.setState({ replicatedSite: target });
  };
  handleAddUpdatedItem = (target) => {
    this.setState({ updatedItem: target });
  };

  handleAdd = (item) => {
    if (item.value && !this.state.webPresenceArray.includes(item.value)) {
      this.setState(
        { webPresenceArray: [...this.state.webPresenceArray, item.value] },
        () => {
          const { changeValue } = this.props.store.RepresentativeState;
          changeValue("web_presence", this.state.webPresenceArray.join(" "));
        }
      );
    }
    if (item && !this.state.webPresenceArray.includes(item)) {
      this.setState(
        { webPresenceArray: [...this.state.webPresenceArray, item] },
        () => {
          const { changeValue } = this.props.store.RepresentativeState;
          changeValue("web_presence", this.state.webPresenceArray.join(" "));
        }
      );
    }
    this.setState({ updatedItem: "" });
  };

  handleUpdate = () => {
    const latestArr = [...this.state.webPresenceArray];
    const updatedArr = latestArr.map((el) => {
      if (el === this.state.selectedUrl) {
        el = this.state.updatedItem;
      }
      return el;
    });
    this.setState({ webPresenceArray: updatedArr }, () => {
      const { changeValue } = this.props.store.RepresentativeState;
      changeValue("web_presence", this.state.webPresenceArray.join(" "));
    });
    this.setState({ webPresenceEditMode: false });
    this.setState({ updatedItem: "" });
  };

  handleRepUpdate = () => {
    this.setState({ repEditMode: false });
  };

  handleClose = () => {
    this.setState({ webPresenceEditMode: false });
    this.setState({ updatedItem: "" });
  };

  setItemToRemove = (item) => {
    this.setState(
      {
        webPresenceArray: this.state.webPresenceArray.filter(function (el) {
          return el !== item;
        }),
      },
      () => {
        this.setState({ updatedItem: "" });
        const { changeValue } = this.props.store.RepresentativeState;
        changeValue("web_presence", this.state.webPresenceArray.join(" "));
      }
    );
    this.setState({ webPresenceEditMode: false });
  };

  removeRepLink = () => {
    this.setState({ repEditMode: true });
    this.setState({ replicatedSite: "" });
    const { changeValue } = this.props.store.RepresentativeState;
    changeValue("replicated_site_url", "");
  };

  setItemToEdit = (item) => {
    this.setState({ webPresenceEditMode: true });
    this.setState({ updatedItem: item });
    this.setState({ selectedUrl: item });
  };

  setRepLinkToEdit = () => {
    this.setState({ repEditMode: true });
  };

  onGetRepresentative = ({ rep_links, ...item }) => {
    const { setItem } = this.props.store.RepresentativeState;
    const { onAutocomplete } = this.props;
    const { rep_statuses, countries, rep_ranks } = this.props;
    let country, rep_rank, rep_status;
    //TODO: Remove this 3 lines after change Rep Form in RepManagement and change Representative format
    if (!!countries) {
      country =
        item.country && countries.filter(({ id }) => id === item.country.id)[0];
    } else {
      country = item.country;
    }
    if (!!rep_ranks) {
      rep_rank =
        item.rep_rank &&
        rep_ranks.filter(({ id }) => id === item.rep_rank.id)[0];
    } else {
      rep_rank = item.rep_rank;
    }
    if (!!rep_statuses) {
      rep_status =
        item.rep_status &&
        rep_statuses.filter(({ id }) => id === item.rep_status.id)[0];
    } else {
      rep_status = item.rep_status;
    }

    const itemToSave = {
      ...item,
      country,
      rep_rank,
      rep_status,
      rep_links,
    };
    setItem(itemToSave);
    if (!!onAutocomplete) {
      onAutocomplete(itemToSave, rep_links);
    }
  };

  @autobind handleChangeGroups(groups, action, group) {
    const { setSelectedGroups, addGroupToList } =
      this.props.store.RepresentativeState;
    if (["add", "remove", "clear"].indexOf(action) > -1) {
      setSelectedGroups(groups);
    } else if (action === "create") {
      this.props.onCreateGroup(group).then((res) => {
        if (!res) {
          return;
        }
        addGroupToList(res);
        setSelectedGroups([...groups, res.id]);
      });
    }
  }

  componentDidMount() {
    const { setRepIdRequired, setItem } = this.props.store.RepresentativeState;
    if (this.props.repIdOptional) {
      setRepIdRequired(false);
    } else {
      setRepIdRequired(true);
    }
    let { item } = this.props.store.RepresentativeState;
    if (
      (item.created_at && item.created_at == null) ||
      (item.created_at && item.created_at == "")
    ) {
      this.setState({ repEditMode: true });
    }
    if (
      (item.created_at && item.created_at !== null) ||
      (item.created_at && item.created_at !== null)
    ) {
      this.setState({ repEditMode: false });
    }
    if (item.web_presence && item.web_presence) {
      const web_presence_item = item.web_presence.trim().split(/\s+/);
      this.setState({ webPresenceArray: web_presence_item });
    }
  }

  componentDidUpdate() {
    let { item } = this.props.store.RepresentativeState;
    if (this.state.didWebPresenceUpdate && item.web_presence) {
      if (item.created_at && item.created_at !== null) {
        this.setState({ didWebPresenceUpdate: false, webPresenceArray: [] });
        const web_presence_item = item.web_presence.trim().split(/\s+/);
        this.setState({ webPresenceArray: web_presence_item });
      }
    }
    if (this.state.didReplicatedSiteUpdate && item.replicated_site_url) {
      this.setState({ replicatedSite: item.replicated_site_url, didReplicatedSiteUpdate: false });
      if (item.created_at && item.created_at !== null) {
        this.setState({ repEditMode: false });
      }
    }
  }

  @autobind handleAddGroup(group) {
    const { RepresentativeState } = this.props.store;
    if (!!group.id) {
      RepresentativeState.addGroup(group);
    } else {
      this.props.onCreateGroup(group).then((res) => {
        RepresentativeState.addGroupToList(res);
        RepresentativeState.addGroup(res);
      });
    }
  }

  @autobind handleClearExistRepresentative() {
    this.props.store.RepresentativeState.setExistRepresentative(null);
  }
  @autobind handleApplyExistRepresentative() {
    const { existRepresentative } = this.props.store.RepresentativeState;
    this.handleAutocompleteSelect(existRepresentative);
    this.handleClearExistRepresentative();
  }

  getStateOptions = () => {
    const { item } = this.props.store.RepresentativeState;
    const { states } = this.props;

    if (!item.country) {
      return [];
    }

    return states.filter((state) => state.country_id === item.country.id);
  };

  render() {
    const {
      store,
      countries,
      rep_ranks,
      rep_statuses,
      rep_languages,
      repAutocompletePath,
      onAutocompleteStart,
      onAutocompleteEnd,
      client,
      client_id,
      client_type
    } = this.props;
    const {
      groups,
      changeValue,
      allValidationMessagesToShow,
      existRepresentative,
      isStateSelectEnabled,
    } = store.RepresentativeState;

    const { isRepIdFocused, autocompletePending } = this.state;
    const isNonFWClient = ['fc'].includes(client_type);
    const autocompleteOptions =
      !!store.RepresentativeState.autocompleteOptions &&
      !!store.RepresentativeState.autocompleteOptions.peek
        ? store.RepresentativeState.autocompleteOptions.peek()
        : null;

    const autocompleteHandleChange = !!repAutocompletePath
      ? this.autocompletableInputChange
      : changeValue;
    let { item } = store.RepresentativeState;
    const isLifetimRankId = ((client && LIFETIMERANKS.LIFETIMERANKSIDS.includes(client.id)) ||
                            (client_id && LIFETIMERANKS.LIFETIMERANKSIDS.includes(client_id))); 
    const isAlternateRankId = ((client && ALTERNATE_RANKS.ALTERNATE_RANK_IDS.includes(client.id)) ||
                              (client_id && ALTERNATE_RANKS.ALTERNATE_RANK_IDS.includes(client_id))) ;                        
    // }
    // let {representative} = item
    // let {country, rep_status, rep_rank} = representative
    // country = {id: country.id, name: country.name}
    // console.log(country)
    // console.log(rep_status)
    // console.log(rep_rank)
    if (!item) {
      item = {};
    }

    return (
      <div className="grid">
        <div className="grid__row">
          <div className="grid__col grid__col--4">
            <FormGroup
              type="text"
              label="First Name"
              vertical="vertical"
              pending={autocompletePending}
              labelAlign="baseline"
              value={item.first_name}
              onAutocompleteStart={onAutocompleteStart}
              onAutocompleteEnd={onAutocompleteEnd}
              onChange={({ target }) =>
              !isNonFWClient && autocompleteHandleChange("first_name", target.value)
              }
              autocompleteOptions={autocompleteOptions}
              optionRenderer={optionRenderer}
              onKeyDown={this.handleAutocompleteKeydown}
              onAutocompleteSelect={this.handleAutocompleteSelect}
              validationMessages={allValidationMessagesToShow.first_name}
              autocomplete={!!repAutocompletePath}
            />
          </div>
          <div className="grid__col grid__col--4">
            <FormGroup
              type="text"
              label="Last Name"
              vertical="vertical"
              labelAlign="baseline"
              value={item.last_name}
              onChange={({ target }) =>
              !isNonFWClient && autocompleteHandleChange("last_name", target.value)
              }
              onKeyDown={this.handleAutocompleteKeydown}
              autocompleteOptions={autocompleteOptions}
              onAutocompleteStart={onAutocompleteStart}
              onAutocompleteEnd={onAutocompleteEnd}
              optionRenderer={optionRenderer}
              onAutocompleteSelect={this.handleAutocompleteSelect}
              validationMessages={allValidationMessagesToShow.last_name}
              pending={autocompletePending}
              autocomplete={!!repAutocompletePath}
            />
          </div>
          <div className="grid__col grid__col--4">
            <Tooltip
              position="bottom"
              type="info"
              body={
                <ExistRepresentativeTooltipBody
                  representative={existRepresentative}
                  onApply={this.handleApplyExistRepresentative}
                  onCancel={this.handleClearExistRepresentative}
                />
              }
              bodyStyle={{
                minWidth: "300px",
                maxWidth: "400px",
              }}
              visible={!!existRepresentative}
            >
              <FormGroup
                type="text"
                label="ID"
                vertical="vertical"
                labelAlign="baseline"
                value={item.rep_id}
                ref={(comp) => {
                  if (!!comp && !!comp.input) {
                    this.repIdInput = comp.input;
                  }
                }}
                pending={autocompletePending}
                autocompleteOptions={!existRepresentative && autocompleteOptions}
                onAutocompleteStart={onAutocompleteStart}
                onAutocompleteEnd={onAutocompleteEnd}
                onFocus={this.handleRepIdFocus}
                onBlur={this.handleRepIdBlur}
                optionRenderer={optionRenderer}
                onKeyDown={this.handleAutocompleteKeydown}
                onAutocompleteSelect={this.handleAutocompleteSelect}
                validationMessages={allValidationMessagesToShow.rep_id}
                onChange={({ target }) =>
                !isNonFWClient && autocompleteHandleChange("rep_id", target.value)
                }
                autocomplete={!!repAutocompletePath}
              />
            </Tooltip>
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--4">
            <FormGroup
              pending={autocompletePending}
              type="email"
              label="Email"
              vertical="vertical"
              labelAlign="baseline"
              autocompleteOptions={autocompleteOptions}
              onAutocompleteStart={onAutocompleteStart}
              onAutocompleteEnd={onAutocompleteEnd}
              optionRenderer={optionRenderer}
              onKeyDown={this.handleAutocompleteKeydown}
              onAutocompleteSelect={this.handleAutocompleteSelect}
              validationMessages={allValidationMessagesToShow.email}
              onChange={({ target }) =>
                autocompleteHandleChange("email", target.value)
              }
              value={item.email}
              autocomplete={!!repAutocompletePath}
            />
          </div>
          <div className="grid__col grid__col--4">
            <FormGroup
              type="text"
              label="Company"
              vertical="vertical"
              labelAlign="baseline"
              onChange={({ target }) =>
                changeValue("company_name", target.value)
              }
              value={item.company_name}
              validationMessages={allValidationMessagesToShow.company_name}
            />
          </div>
          <div className="grid__col grid__col--4">
            <FormGroup
              type="date"
              label="Join Date"
              vertical="vertical"
              labelAlign="baseline"
              validationMessages={allValidationMessagesToShow.join_date}
              clearable
              onChange={(date) => changeValue("join_date", date)}
              value={item.join_date}
            />
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--6">
            <FormGroup
              type="tel"
              label="Cell Phone"
              autocompleteOptions={autocompleteOptions}
              onAutocompleteStart={onAutocompleteStart}
              onAutocompleteEnd={onAutocompleteEnd}
              onFocus={this.handleRepIdFocus}
              onKeyDown={this.handleAutocompleteKeydown}
              onAutocompleteSelect={this.handleAutocompleteSelect}
              optionRenderer={optionRenderer}
              vertical="vertical"
              labelAlign="baseline"
              pending={autocompletePending}
              onChange={({ target }) =>
                autocompleteHandleChange("phone", target.value)
              }
              value={item.phone}
              autocomplete={!!repAutocompletePath}
              validationMessages={allValidationMessagesToShow.phone}
            />
          </div>
          <div className="grid__col grid__col--6">
            <FormGroup
              type="tel"
              label="Alternate Phone"
              vertical="vertical"
              labelAlign="baseline"
              autocompleteOptions={autocompleteOptions}
              onAutocompleteStart={onAutocompleteStart}
              onAutocompleteEnd={onAutocompleteEnd}
              onFocus={this.handleRepIdFocus}
              onKeyDown={this.handleAutocompleteKeydown}
              pending={autocompletePending}
              onAutocompleteSelect={this.handleAutocompleteSelect}
              optionRenderer={optionRenderer}
              autocomplete={!!repAutocompletePath}
              onChange={({ target }) =>
                autocompleteHandleChange("alternate_phone", target.value)
              }
              value={item.alternate_phone}
              validationMessages={allValidationMessagesToShow.alternate_phone}
            />
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--6">
            <FormGroup
              type="select"
              newSelect
              label="Country"
              vertical="vertical"
              labelAlign="baseline"
              clearable
              onChange={(_, country) => changeValue("country", country)}
              options={countries}
              valueKey="id"
              labelKey="name"
              value={item.country}
            />
          </div>
          <div className="grid__col grid__col--6">
            <FormGroup label="State" vertical="vertical" labelAlign="baseline">
              <Select
                value={item.us_state_id}
                onChange={(id) => changeValue("us_state_id", id)}
                options={this.getStateOptions()}
                newSelect
                disabled={!isStateSelectEnabled}
              />
            </FormGroup>
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--6">
            <FormGroup
              type="select"
              label="Preferred Language"
              vertical="vertical"
              labelAlign="baseline"
              newSelect
              clearable
              onChange={(id) => changeValue("rep_language_id", id)}
              options={rep_languages}
              valueKey="id"
              labelKey="name"
              value={item.rep_language_id}
            />
          </div>
          <div className="grid__col grid__col--6">
            <FormGroup
              type="select"
              label="Status"
              vertical="vertical"
              labelAlign="baseline"
              newSelect
              clearable
              onChange={(id) =>
                changeValue("rep_status", {
                  ...item.rep_status,
                  id,
                })
              }
              options={rep_statuses}
              valueKey="id"
              labelKey="name"
              value={item.rep_status}
            />
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--6">
            <FormGroup
              type="text"
              label="Sponsor ID"
              vertical="vertical"
              labelAlign="baseline"
              onChange={({ target }) =>
                this.autocompletableSponsorId("sponsor_rep_id", target.value)
              }
              autocomplete={!!repAutocompletePath}
              pending={autocompletePending}
              validationMessages={allValidationMessagesToShow.sponsor_rep_id}
              value={item.sponsor_rep_id}
            />
            {!!item.sponsor_full_name && <div>{item.sponsor_full_name}</div>}
          </div>
          <div className="grid__col grid__col--6">
            <FormGroup
              type="url"
              label="Sponsor Email"
              vertical="vertical"
              labelAlign="baseline"
              onChange={({ target }) =>
                changeValue("sponser_rep_email", target.value)
              }
              pending={autocompletePending}
              value={item.sponser_rep_email}
              autocomplete={!!repAutocompletePath}
            />
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--6">
            <FormGroup
              type="select"
              label="Rank"
              vertical="vertical"
              newSelect
              labelAlign="baseline"
              clearable
              onChange={(id) =>
                changeValue("rep_rank", {
                  ...item.rep_rank,
                  id,
                })
              }
              options={rep_ranks}
              valueKey="id"
              labelKey="name"
              value={item.rep_rank}
            />
          </div>
          {(isLifetimRankId || isAlternateRankId) && (
            <div className="grid__col grid__col--6">
              <FormGroup
                type="select"
                label={isLifetimRankId ? "Lifetime Rank" : "Alternate Rank"}
                vertical="vertical"
                newSelect
                labelAlign="baseline"
                clearable
                onChange={(id) =>
                  changeValue("additional_rep_rank", {
                    ...item.additional_rep_rank,
                    id,
                  })
                }
                options={rep_ranks}
                valueKey="id"
                labelKey="name"
                value={item.additional_rep_rank}
              />
            </div>
          )}
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--12">
            <FormGroup
              type="textarea"
              label="Additional Notes"
              vertical="vertical"
              labelAlign="baseline"
              onChange={({ target }) =>
                changeValue("additional_notes", target.value)
              }
              value={item.additional_notes}
            />
          </div>
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--12">
            <FormGroup label="Groups" vertical labelAlign="baseline">
              <TagsSelect
                value={item.groups}
                onChange={this.handleChangeGroups}
                options={groups}
              />
            </FormGroup>
          </div>
        </div>
        <div className="grid__row">
          <div
            className="grid__col grid__col--12"
            style={{ paddingTop: "5px" }}
          >
            Representative Web Presence
          </div>
        </div>{" "}
        <hr style={{ marginTop: "-8px" }}></hr>
        <div className="grid__row">
          <div className="grid__col grid__col--2">Replicated Site :</div>
          {!this.state.repEditMode && (
            <div className="grid__col grid__col--7">
              <a
                href={item.replicated_site_url}
                target={item.replicated_site_url}
              >
                {item.replicated_site_url}
              </a>
            </div>
          )}
          {this.state.repEditMode && (
            <div className="grid__col grid__col--7">
              <FormGroup
                type="url"
                labelAlign="baseline"
                onChange={({ target }) => {
                  autocompleteHandleChange(
                    "replicated_site_url",
                    target.value.replace(",", " ")
                  ),
                    this.handleAddRepToState(target.value);
                }}
                autocompleteOptions={autocompleteOptions}
                onAutocompleteStart={onAutocompleteStart}
                onAutocompleteEnd={onAutocompleteEnd}
                onFocus={this.handleRepIdFocus}
                onKeyDown={this.handleAutocompleteKeydown}
                onAutocompleteSelect={this.handleAutocompleteSelect}
                optionRenderer={optionRenderer}
                pending={autocompletePending}
                autocomplete={!!repAutocompletePath}
                // onKeyDown={(e) => {
                //   e.keyCode === 13 && this.handleRepUpdate();
                // }}
                value={item.replicated_site_url}
                validationMessages={
                  allValidationMessagesToShow.replicated_site_url
                }
              />
            </div>
          )}
          {!this.state.repEditMode && (
            <div className="grid__col grid__col--2">
              <IconButton
                tooltip="Edit Record"
                icon="pe-7s-note"
                onClick={() => this.setRepLinkToEdit(item)}
              />
              {/* <div> */}
              <IconButton
                tooltip="Destroy Record"
                icon="pe-7s-close-circle"
                onClick={() => this.removeRepLink(item)}
              />
              {/* </div> */}
            </div>
          )}
          {this.state.repEditMode && (
            <div
              className="grid__col grid__col--2"
              style={{ paddingTop: "12px" }}
            >
              <Button
                type="submit"
                size="small"
                status="black"
                disabled={this.state.replicatedSite == ""}
                onClick={() => this.handleRepUpdate()}
              >
                + Add
              </Button>
            </div>
          )}
        </div>
        <div className="grid__row">
          <div className="grid__col grid__col--2">Web Presence :</div>
          <div className="grid__col grid__col--7">
            <FormGroup
              type="url"
              labelAlign="baseline"
              onChange={({ target }) => this.handleAddUpdatedItem(target.value)}
              onKeyDown={(e) => {
                (e.keyCode === 13 &&
                  this.state.webPresenceEditMode &&
                  this.handleUpdate()) ||
                  (e.keyCode === 13 &&
                    !this.state.webPresenceEditMode &&
                    this.handleAdd(this.state.updatedItem));
              }}
              validationMessages={allValidationMessagesToShow.web_presence}
              value={this.state.updatedItem}
            />
            {/* {!!item.sponsor_full_name && <div>{item.sponsor_full_name}</div>} */}
          </div>
          {!this.state.webPresenceEditMode && (
            <div
              className="grid__col grid__col--2"
              style={{ paddingTop: "12px" }}
            >
              <Button
                size="small"
                status="black"
                disabled={this.state.updatedItem === ""}
                onClick={() => {
                  this.handleAdd(this.state.updatedItem);
                }}
              >
                + Add
              </Button>
            </div>
          )}
          {this.state.webPresenceEditMode && (
            <div
              className="grid__col grid__col--3"
              style={{ paddingTop: "12px" }}
            >
              <Button
                type="submit"
                size="small"
                status="blue"
                onClick={() => this.handleUpdate()}
              >
                Update
              </Button>
              <Button
                style={{ paddingLeft: "10px" }}
                type="submit"
                size="small"
                status="black"
                onClick={() => this.handleClose()}
              >
                Close
              </Button>
            </div>
          )}
        </div>
        {this.state.webPresenceArray.map((item, index) => {
          return (
            <div key={index + 1} className="grid__row">
              <div className="grid__col grid__col--2">&nbsp;</div>
              <div className="grid__col grid__col--7">
                <a href={item} target={item}>
                  {item}
                </a>
              </div>

              <IconButton
                tooltip="Edit Record"
                icon="pe-7s-note"
                onClick={() => this.setItemToEdit(item)}
              />

              <IconButton
                tooltip="Destroy Record"
                icon="pe-7s-close-circle"
                onClick={() => this.setItemToRemove(item)}
              />

              <div className="grid__col grid__col--2"></div>
            </div>
          );
        })}
      </div>
    );
  }
}
