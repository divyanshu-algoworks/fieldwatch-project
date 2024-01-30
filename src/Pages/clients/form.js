import React from "react";
import CommonForm from "Components/CommonForm";
import Paper from "Components/Paper";
import AvatarControl from "Components/AvatarControl";
import FormGroup from "Components/FormGroup";
import Input from "Components/Input";
import Button from "Components/Button";
import Select from "Components/Select";
import TagsSelect from "Components/TagsControls/TagsSelect";
import QuestionMark from "Components/QuestionMark";
import { checkRequired } from "Helpers/validators";
import { searchTimezone } from "Helpers/search";
import { getClientType } from "Helpers/cookie";
import IconButton from "Components/IconButton";
import TextEditor from "Components/TextEditor/index";
export default class ClientForm extends CommonForm {
  modelName = "client";
  validators = {
    name: checkRequired("name"),
    rep_label: checkRequired("rep_label"),
    client_type: checkRequired("client_type"),
  };

  handleChangeName = ({ target }) => this.changeValue("name", target.value);
  handleChangeSite = ({ target }) => this.changeValue("website", target.value);
  handleChangeEmail = ({ target }) =>
    this.changeValue("admin_email", target.value);
  handleChangeRepLabel = ({ target }) =>
    this.changeValue("rep_label", target.value);
  handleChangeInstruction = (value) => {
    this.changeValue("instruction", value);
  };
  handleChangeTimeZone = (time_zone) =>
    this.changeValue("time_zone", time_zone);
  handleChangeFCClient = (clientId) => {
    const { item } = this.state;
    item.fc_client_id_edit = true;
    item.fc_client_id = clientId;
    this.setState({ item });
  };
  handleChangeAvatar = (logo) => {
    this.changeValue("logo", logo);
    this.enableSubmit();
  };

  handleChangeSaas = ({ target }) => this.changeValue("saas", target.checked);
  handleChangeHold = ({ target }) => this.changeValue("onhold", target.checked);
  handleQueryEditAbility = ({ target }) => {
    let { item } = this.state;
    item.features.query_ability_enabled = target.checked;

    this.setState({ item: item });
  };
  handleUserEditAbility = ({ target }) => {
    let { item } = this.state;
    item.features.user_ability_enabled = target.checked;

    this.setState({ item: item });
  };
  handleChangeRemidiation = ({ target }) => {
    let { item } = this.state;
    item.can_send_warning_email = target.checked;
    this.setState({ item });
  };
  handleChangeAvatarUploadProgress = (progress) => {
    if (!!progress) {
      this.disableSubmit();
    } else {
      this.enableSubmit();
    }
  };

  handleChangeEndpoint = ({ target }) => {
    let { item } = this.state;
    const { name, value } = target;
    if (
      name === "secure_token" &&
      item.endpoint.secure_token &&
      item.endpoint.secure_token.startsWith("***********")
    ) {
      this.setState({ item });
      return;
    }
    item.endpoint[name] = value;
    this.setState({ item });
  };

  removeSecureToken = () => {
    let { item } = this.state;
    item.endpoint.secure_token = "";
    this.setState({ item });
  };

  handleChangeAuthentications = ({ target }) => {
    let { item } = this.state;
    const { checked, value } = target;
    item.authentication_type = value;
    item.webhook_endpoint_service = true;
    if (checked && value === "ac") item.endpoint.authentication = checked;
    else item.endpoint.authentication = false;
    this.setState({ item });
  };

  handleDisableWebhook = () => {
    let { item } = this.state;
    const { endpoint } = this.props;
    item.endpoint = JSON.parse(JSON.stringify(endpoint || {}));
    item.webhook_endpoint_service = false;
    this.setState({ item });
  };

  handleChangeClient = ({ target }) => {
    if (target.value === "non-fc") this.changeValue("client_type", "fc");
    else this.changeValue("client_type", target.value);
  };

  handleChangeterritory = (territory, action, terri) => {
    let { item } = this.state;
    if (["add", "remove", "clear"].indexOf(action) > -1) {
      item.remediation_condition.territories = territory;
      this.setState({ item });
    }
  };

  handleChangeCountry = (country, action, contri) => {
    let { item } = this.state;
    if (["add", "remove", "clear"].indexOf(action) > -1) {
      item.remediation_condition.country = country;
      this.setState({ item });
    }
  };

  handleChangeRepRanks = (rank, action, rep_rank) => {
    let { item } = this.state;
    if (["add", "remove", "clear"].indexOf(action) > -1) {
      item.remediation_condition.rep_ranks = rank;
      this.setState({ item });
    }
  };

  getComplainceReminderOptions = () => {
    return [
      {
        id: 1,
        name: '1'
      },
      {
        id: 2,
        name: '2'
      },
      {
        id: 3,
        name: '3'
      },
      {
        id: 4,
        name: '4'
      },
      {
        id: 5,
        name: '5'
      },
    ]
  }

  render() {
    const {
      time_zones,
      upload_avatar_url,
      default_image_url,
      current_user_role,
      fc_clients = [],
      clientTerritory,
      countries,
      rep_ranks,
    } = this.props;
    const { item, submitDisabled, submitClicked, submitEndpointErrors } =
      this.state;
    const { endpoint, authentication_type, webhook_endpoint_service, remediation_condition } = item;
    const { username, password } = endpoint;
    const client_type = getClientType();
    const showEndpointOptions = !!endpoint && endpoint.authentication;
    const showDeleteIcon =
      endpoint.secure_token && endpoint.secure_token.startsWith("********");
    return (
      <form
        onSubmit={(e) => {
          this.setState({ submitClicked: true, submitEndpointErrors: true }),
            this.handleSubmit(e);
        }}
      >
        <Paper className="w-114">
          <Paper.Header>
            <Paper.Title>{item.id ? "Company Info" : "New Client"}</Paper.Title>
            <Button
              type="submit"
              className={`${
                ["fc"].includes(client_type) ||
                ["fw_specialist", "client_admin", "client_specialist"].includes(current_user_role) || submitDisabled ||
                (submitClicked && Object.keys(this.validationMessages).length === 0)
                ? "disabled_element"
                  : ""
              }`}
            >
              {item.id ? "Save Changes" : "Create Client"}
            </Button>
          </Paper.Header>
          <Paper.Body>
            <div className="client-form">
              <AvatarControl
                onChange={this.handleChangeAvatar}
                uploadUrl={upload_avatar_url}
                onUploadProgressChange={this.handleChangeAvatarUploadProgress}
                defaultImgUrl={default_image_url}
                value={item.logo || { id: null, src: default_image_url }}
                avatarKeyName="logo"
                clientType={client_type}
              />
              <div className="client-info__client-info">
                <FormGroup
                  labelStyle={{ width: "140px" }}
                  label="Company Name"
                  validationMessages={this.validationMessages.name}
                >
                  <Input
                    className="w-100p"
                    value={item.name}
                    onChange={this.handleChangeName}
                    invalid={!!this.validationMessages.name}
                  />
                </FormGroup>
                <FormGroup
                  labelStyle={{ width: "140px" }}
                  label="Company Website"
                >
                  <Input
                    className="w-100p"
                    value={item.website}
                    onChange={this.handleChangeSite}
                  />
                </FormGroup>
                <FormGroup
                  labelStyle={{ width: "140px" }}
                  label="Administrator Email"
                >
                  <Input
                    className="w-100p"
                    type="email"
                    value={item.admin_email}
                    onChange={this.handleChangeEmail}
                  />
                </FormGroup>
                <FormGroup
                  labelStyle={{ width: "140px" }}
                  label="Rep Label"
                  validationMessages={this.validationMessages.rep_label}
                >
                  <Input
                    className="w-100p"
                    value={item.rep_label}
                    onChange={this.handleChangeRepLabel}
                    invalid={!!this.validationMessages.rep_label}
                  />
                </FormGroup>
              </div>
              {!!item.id && (
                <div className="client-form__addon">
                  <div className="client-form__addon-block">
                    <div>
                      <b>
                        {["fc"].includes(client_type)
                          ? item.id.toString().charAt(0) + "xx"
                          : item.id}
                      </b>
                    </div>
                    CLIENT ID
                  </div>
                  <div className="client-form__addon-block">
                    <div>
                      <b>
                        {["fc"].includes(client_type)
                          ? item.access_token.substring(0, 15) + "xxxxxxxx"
                          : item.access_token}
                      </b>
                    </div>
                    ACCESS TOKEN
                  </div>
                </div>
              )}
            </div>
          </Paper.Body>
          <div className="grid mt-10">
            <div className="grid__row d-f">
              <div className="grid__col grid__col--6">
                {!["fc"].includes(client_type) && (
                  <FormGroup
                    labelStyle={{ width: "140px", marginBottom: "28px" }}
                    label="Onboard As"
                    validationMessages={this.validationMessages.client_type}
                  >
                    <Input
                      type="radio"
                      checked={item.client_type === "fw"}
                      onChange={this.handleChangeClient}
                      label="FW Client"
                      value="fw"
                      invalid={!!this.validationMessages.client_type}
                    />
                    <QuestionMark
                      marginLeft={"5px"}
                      tooltip="Complete access to whole product"
                    />
                    <div className="radio-margin-top">
                      <Input
                        type="radio"
                        checked={["fc", "non-fc", "ethics_pro"].includes(
                          item.client_type
                        )}
                        onChange={this.handleChangeClient}
                        label="Non-FW Client"
                        value="non-fc"
                        invalid={!!this.validationMessages.client_type}
                      />
                      <QuestionMark
                        marginLeft={"5px"}
                        tooltip="Limited access as per selected Role"
                      />
                    </div>
                    {["non-fc", "fc", "ethics_pro"].includes(
                      item.client_type
                    ) && (
                      <div className="radio-margin">
                        <Input
                          type="radio"
                          checked={item.client_type === "fc"}
                          onChange={this.handleChangeClient}
                          label="FC Only Users"
                          value="fc"
                          invalid={!!this.validationMessages.client_type}
                        />
                        <QuestionMark
                          marginLeft={"5px"}
                          tooltip="Access to read-only Incidents (Demo screen initially and then created incidents as a 1-off project by Specialists),
                         FC Analytics - Client Level Only, Read Only Static Pages on all other tabs."
                        />
                        <br />
                        <div className="radio-margin-top">
                          <Input
                            type="radio"
                            checked={item.client_type === "ethics_pro"}
                            onChange={this.handleChangeClient}
                            label="Ethics pro Premium"
                            value="ethics_pro"
                            disabled={true}
                            invalid={!!this.validationMessages.client_type}
                          />
                          <QuestionMark
                            marginLeft={"5px"}
                            tooltip="EP Premium/Stand alone - Provide Access to all EP Analytics in FW for Non-FW Clients,
                          Access to read-only Incidents (created as a 1-off project by Specialists), Read Only Static Pages on all other tabs."
                          />
                        </div>
                      </div>
                    )}
                  </FormGroup>
                )}
                <FormGroup labelStyle={{ width: "140px" }} label="Time Zone">
                  <Select
                    className="w-75p"
                    value={item.time_zone}
                    newSelect
                    searchFn={searchTimezone}
                    options={time_zones}
                    onChange={this.handleChangeTimeZone}
                  />
                </FormGroup>

                {(current_user_role === "fw_specialist" ||
                  current_user_role === "fw_admin") && (
                  <FormGroup labelStyle={{ width: "140px" }} label=" ">
                    <div className="mb-10">
                      <Input
                        className="w-100p"
                        type="checkbox"
                        label="On Hold"
                        checked={item.onhold}
                        onChange={this.handleChangeHold}
                      />
                    </div>
                    <div className="mb-10">
                      <Input
                        className="w-100p"
                        type="checkbox"
                        label="SaaS"
                        checked={item.saas}
                        onChange={this.handleChangeSaas}
                      />
                    </div>
                    {this.props.current_user_role === "fw_admin" && (
                      <span>
                        <div className="mb-10">
                          <Input
                            className="w-100p"
                            type="checkbox"
                            label="Query Edit Ability"
                            checked={item.features.query_ability_enabled}
                            onChange={this.handleQueryEditAbility}
                          />
                        </div>
                        <div className="mb-10">
                          <Input
                            className="w-100p"
                            type="checkbox"
                            label="User Edit Ability"
                            checked={item.features.user_ability_enabled}
                            onChange={this.handleUserEditAbility}
                          />
                        </div>
                      </span>
                    )}
                  </FormGroup>
                )}
                {["fw_admin", "client_admin", "client_specialist"].includes(
                  current_user_role
                ) && (
                  <FormGroup
                    labelStyle={{ width: "140px" }}
                    label="FieldCheck Client"
                  >
                    <Select
                      className="w-75p"
                      value={item.fc_client_id}
                      newSelect
                      options={fc_clients}
                      onChange={this.handleChangeFCClient}
                      disabled={["client_admin", "client_specialist"].includes(
                        current_user_role
                      )}
                      valueKey="client_id"
                      labelKey="client_name"
                    />
                  </FormGroup>
                )}
                 <FormGroup
                    labelStyle={{ width: "140px" }}
                    label="Incident Team Reminder"
                  >
                    <Select
                      className="w-75p"
                      value={item.reminder_duration}
                      newSelect
                      options={this.getComplainceReminderOptions()}
                      onChange={(id) => this.changeValue("reminder_duration", id)}
                      disabled={["client_admin", "client_specialist"].includes(
                        current_user_role
                      )}
                      valueKey="id"
                      labelKey="name"
                    />
                  </FormGroup>
              </div>
              <div className="vertical-row mr-10"></div>

              <div className="grid__col grid__col--6">
                <FormGroup
                  labelStyle={{ width: "140px", marginBottom: "50px" }}
                  label="Webhook Endpoint"
                >
                  <Input
                    type="radio"
                    checked={
                      authentication_type === "ac" && webhook_endpoint_service
                    }
                    onChange={this.handleChangeAuthentications}
                    label="Authenticated"
                    value="ac"
                  />
                  <div className="radio-margin-top">
                    <Input
                      type="radio"
                      checked={
                        authentication_type === "non-ac" &&
                        webhook_endpoint_service
                      }
                      onChange={this.handleChangeAuthentications}
                      label="Non Authenticated"
                      value="non-ac"
                    />
                  </div>
                  <div className="radio-margin-top">
                    <Input
                      type="radio"
                      checked={!webhook_endpoint_service}
                      onChange={this.handleDisableWebhook}
                      label="Disabled"
                      value="disable"
                    />
                  </div>
                </FormGroup>
                {!!authentication_type && (
                  <FormGroup
                    labelStyle={{ width: "140px" }}
                    label="Endpoint"
                    validationMessages={
                      !!authentication_type &&
                      webhook_endpoint_service &&
                      submitEndpointErrors &&
                      !endpoint.endpoint &&
                      "can't be blank"
                    }
                  >
                    <Input
                      className="w-75p"
                      value={endpoint.endpoint}
                      name="endpoint"
                      disabled={!webhook_endpoint_service}
                      onChange={this.handleChangeEndpoint}
                      invalid={
                        !!authentication_type &&
                        submitEndpointErrors &&
                        webhook_endpoint_service &&
                        !endpoint.endpoint
                      }
                    />
                  </FormGroup>
                )}
                {showEndpointOptions && (
                  <div className="mt-10 mb-10">
                    <FormGroup
                      labelStyle={{ width: "140px" }}
                      label="Username"
                      validationMessages={
                        showEndpointOptions &&
                        webhook_endpoint_service &&
                        submitEndpointErrors &&
                        !username &&
                        "can't be blank"
                      }
                    >
                      <Input
                        className="w-75p"
                        value={username}
                        name="username"
                        disabled={!webhook_endpoint_service}
                        onChange={this.handleChangeEndpoint}
                        invalid={
                          showEndpointOptions &&
                          webhook_endpoint_service &&
                          submitEndpointErrors &&
                          !username
                        }
                      />
                    </FormGroup>
                    <FormGroup
                      labelStyle={{ width: "140px" }}
                      label="Password"
                      validationMessages={
                        showEndpointOptions &&
                        webhook_endpoint_service &&
                        submitEndpointErrors &&
                        !password &&
                        "can't be blank"
                      }
                    >
                      <Input
                        className="w-75p"
                        value={endpoint.password}
                        disabled={!webhook_endpoint_service}
                        name="password"
                        onChange={this.handleChangeEndpoint}
                        invalid={
                          showEndpointOptions &&
                          webhook_endpoint_service &&
                          submitEndpointErrors &&
                          !password
                        }
                      />
                    </FormGroup>
                  </div>
                )}
                {!!authentication_type && (
                  <FormGroup
                    labelStyle={{ width: "140px" }}
                    label={`Secret Token`}
                    validationMessages={
                      !!authentication_type &&
                      webhook_endpoint_service &&
                      submitEndpointErrors &&
                      !endpoint.secure_token &&
                      "can't be blank"
                    }
                  >
                    <div className={`wrapper ${showDeleteIcon ? "" : ""}`}>
                      <Input
                        className="w-75p"
                        value={endpoint.secure_token}
                        name="secure_token"
                        disabled={!webhook_endpoint_service}
                        onChange={this.handleChangeEndpoint}
                        invalid={
                          !!authentication_type &&
                          submitEndpointErrors &&
                          webhook_endpoint_service &&
                          !endpoint.secure_token
                        }
                      />
                      {showDeleteIcon && (
                        <IconButton
                          className="clear"
                          icon="pe-7s-close-circle icon icon--bold icon--button"
                          onClick={() => {
                            this.removeSecureToken();
                          }}
                        />
                      )}
                      <QuestionMark
                        className="tooltip-token"
                        tooltip="This key is being stored only in salted and encrypted form due to security reasons."
                      />
                    </div>
                  </FormGroup>
                 )}
                   {current_user_role === "fw_admin" && (
                       <React.Fragment>
                         <FormGroup labelStyle={{ width: "140px" }} label="Remediation">
                       <div>
                         <Input
                           className="w-100p mt-10"
                           type="checkbox"
                           label="Remediation Disable"
                           checked={item.can_send_warning_email}
                           onChange={this.handleChangeRemidiation}
                         />
                         &nbsp;
                         <QuestionMark tooltipWidth={400} tooltip="On Enabling, FW Specialists will not be able to send warning emails to any reps. 
                          If below filters are added, emails can be sent to others but not to reps in those selected filters." />
                       </div>
                       </FormGroup>
                       {item.can_send_warning_email && (
                         <FormGroup label="">
                           <div className="radio-margin-top w-60p ml-17r">
                             <FormGroup 
                              label="Territory"
                              vertical
                              labelAlign="baseline"
                             >
                               <TagsSelect
                                 style={{
                                
                                 }}
                                 value={remediation_condition.territories}
                                 options={clientTerritory || []}
                                 onChange={this.handleChangeterritory}
                                 forPolicy={true}
                               />
                             </FormGroup>
                           </div>
                           <div className="radio-margin-top w-60p ml-17r">
                             <FormGroup 
                              label="Country"
                              vertical
                              labelAlign="baseline"
                              >
                               <TagsSelect
                                 style={{
                                 
                                 }}
                                 value={remediation_condition.country}
                                 options={countries || []}
                                 onChange={this.handleChangeCountry}
                                 forPolicy={true}
                               />
                             </FormGroup>
                           </div>
                           <div className="radio-margin-top w-60p ml-17r">
                             <FormGroup 
                              label="Rep Rank"
                              vertical
                              labelAlign="baseline"
                              >
                               <TagsSelect
                                 style={{
                                
                                 }}
                                 value={remediation_condition.rep_ranks}
                                 options={rep_ranks || []}
                                 onChange={this.handleChangeRepRanks}
                                 forPolicy={true}
                               />
                             </FormGroup>
                           </div>
                         </FormGroup>
                       )}
                     </React.Fragment>
                    )}
              </div>
            </div>
          </div>
          {current_user_role === "fw_admin" ? (
            <FormGroup
              labelStyle={{ width: "140px", height: "240px", marginTop: "15px", instruction: true}}
              label="Instructions"
            >
              <TextEditor
                value={item.instruction || ""}
                onChange={this.handleChangeInstruction}
                editorHeight={{ height: "14rem" }}
              />
            </FormGroup>
          ) :
          <div className="h-30p"></div>
          }
        </Paper>
      </form>
    );
  }
}

