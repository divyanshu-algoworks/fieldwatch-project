import { Component } from "react";
import API from "../../helpers/api";
import { setObjectValue, isEmpty } from "../../helpers/object";
import GAEvents from "../../constants/GAEvents";
import { isDisableMultipleSubmit } from "../../helpers/submitForm";
export default class CommonForm extends Component {
  state = {
    submitted: false,
    submitDisabled: false,
    submitClicked: false,
    penging: false,
    item: {},
    serverErrors: {},
    isDialogOpen: false,
  };
  modelName = "";
  additionParams = {};
  additionData = null;
  validators = {};
  defaultItem = {};
  updateMethod = "put";

  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    this.setInitialData.call(this);
  }

  setInitialData() {
    let item = this.props[this.modelName] || this.defaultItem;
    if(this.props.features) {
      item.features = this.props.features;
    }
    if(this.modelName === 'client') {
      const { endpoint, client, remediation_condition } = this.props;
      item.endpoint = JSON.parse(JSON.stringify(endpoint || {}));
      item.webhook_endpoint_service = client.webhook_endpoint_service;
      item.remediation_condition = JSON.parse(JSON.stringify(item.remediation_condition || {} ));
      if (endpoint) {
        item.authentication_type = endpoint.authentication ? 'ac' : 'non-ac'
      }
    }
    if (!!item) {
      this.setItem(item);
    }
  }

  setSubmitted = () => this.setState({ submitted: true });
  setUnsubmited = () => this.setState({ submitted: false });
  setItem = (item, callback) => this.setState({ item }, callback);
  setServerErrors = (errors) => {
    const serverErrors =
      typeof errors === "string" ? JSON.parse(errors) : errors;
    this.setState({ serverErrors });
  };

  changeValue = (key, value, callback) => {
    const { item, serverErrors } = this.state;
    if (serverErrors && serverErrors[key]) {
      delete serverErrors[key];
    }
    this.setState(
      { item: setObjectValue(item, key, value), serverErrors },
      callback
    );
  };

  handleSubmit = (e, callback, sub_domain = '') => {
    if (!!e) {
      e.preventDefault();
    }
    if (
      !!this.state.submitDisabled &&
      !this.modelName === "compliance_action"
    ) {
      return;
    }

    
    const url = this.url || this.props.url;
    this.setSubmitted();
    if (!this.isFormValid || this.endpointErrors()) {
      if (sub_domain && !this.state.fwDefaultChecked && !this.state.subDomainDefaultChecked) {
        this.setState({subDomainThrowError: true});
      }
      this.setState({ submitClicked: false });
      return;
    }

    if(this.state.subDomainThrowError) {
      return;
    }
    if(sub_domain) {
      this.setState({isDialogOpen: true});
      return
    }
    if (isDisableMultipleSubmit(this.modelName)) {
      this.disableSubmit();
    }
    const serializedItem = this.serializedItem;
    const id = this.itemID || this.state.item.id;
    const method = id === undefined || id === null ? "post" : this.updateMethod;
    const urlToSend = this.url ;// method === "post" ? url : `${url}/${id}`;
    let body = !!this.modelName
      ? { [this.modelName]: serializedItem }
      : serializedItem;
    this.setState({isDialogOpen: false});
    const user = this.props.current_user
      ? this.props.current_user
      : this.props.current_user_role;
    if (!!this.additionData) {
      body = { ...body, ...this.additionData };
    }
        this.setState({ pending: true });
        if (sub_domain && !this.state.subDomainDefaultChecked) {
          body['proxy_smtp_setting'].sub_domain = '';
        }
    if (!!user && !!user.id) {
      GAEvents.commonFormSubmit(this.props.analytics_key, url, method, user.id);
    }
    API[method](urlToSend, {
      body,
      ...this.additionParams,
    }).then((data) => {
      this.setState({ pending: false, submitClicked: false });
      if (
        (isEmpty(data) || !!data.errors) &&
        isDisableMultipleSubmit(this.modelName)
      ) {
        this.enableSubmit();
      }
      if (!!data.errors) {
        this.setServerErrors(data.errors);
      } else {
        callback && document.location.reload();
        if (!!this.onSuccessSubmit) {
          this.onSuccessSubmit(this.serializedItem, data);
        }
      }
    });
  };

  endpointErrors = () => {
    const { item } = this.state;
    if(!item.endpoint || !item.authentication_type || !item.webhook_endpoint_service) return false;
     const { endpoint, username, password, authentication, secure_token } = item.endpoint;
     if (authentication) {
       return !username || !password || !endpoint || !secure_token;
     }
     else {
      item.endpoint.username = ''
      item.endpoint.password = ''
      if (!endpoint || !secure_token) return true;
      this.setItem(item);
      return !endpoint;
     }
  }

  disableSubmit = () => {
    if (!this.state.submitDisabled) {
      this.setState({ submitDisabled: true });
    }
  };

  enableSubmit = () => {
    if (!!this.state.submitDisabled) {
      this.setState({ submitDisabled: false });
    }
  };

  get clientValidationMessages() {
    return Object.keys(this.validators).reduce((msgs, key) => {
      const msg =
        this.validators[key](this.state, this.props) ||
        this.state.serverErrors[key];
        
      if (!!msg) {
        msgs[key] = msg;
      }

      return msgs;
    }, {});
  }

  get allValidationMessages() {
    return {
      ...this.clientValidationMessages,
      ...this.state.serverErrors,
    };
  }

  get validationMessages() {
    if (!this.state.submitted) {
      return {};
    }
    return this.allValidationMessages;
  }

  get isFormValid() {
    return !Object.keys(this.clientValidationMessages).length;
  }

  get serializedItem() {
    return this.state.item;
  }
}
