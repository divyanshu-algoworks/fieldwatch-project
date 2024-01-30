import { observable, action, computed, toJS, } from "mobx";
import { autobind } from 'core-decorators';
import processObjectForModel from '../helpers/processObjectForModel';

export default class ItemState {
  @observable item = {};
  @observable isFormSubmitted = false;
  @observable serverErrors = {};
  validators = {};
  startItem = null;

  @autobind @action setItem(item, replaceStartItem = false) {
    this.item = item;
    if (this.startItem === null || !!replaceStartItem) {
      this.startItem = JSON.stringify(processObjectForModel(item)); //toImmutableMap(item);
    }
  }

  @autobind @action resetStartItem() {
    this.startItem = JSON.stringify(processObjectForModel(toJS(this.item)));
    this.serverErrors = {};
  }

  @autobind @action submitForm() {
    this.serverErrors = {};
    this.isFormSubmitted = true;
  }

  @autobind @action unsubmitForm() {
    this.isFormSubmitted = false;
    this.serverErrors = {};
  }

  @autobind @action changeValue(key, value) {
    this.item = {
      ...this.item,
      [`${key}`]: value,
    };
    if (!!this.serverErrors[key]) {
      delete this.serverErrors[key];
    }
  }

  @autobind @action setServerErrors(errors) {
    this.serverErrors = errors;
  }

  @computed get clientValidationMessages() {
    return Object.keys(this.validators).reduce((msgs, key) => {
      if (!!this.validators[key](this.item) || !!this.serverErrors[key]) {
        msgs[key] = this.validators[key](this.item) || this.serverErrors[key];
      }

      return msgs;
    }, {});
  }

  @computed get clientValidationMessagesToShow() {
    if (!this.isFormSubmitted) {
      return {};
    }
    return this.clientValidationMessages;
  }

  @computed get allValidationMessagesToShow() {
    return {
      ...this.clientValidationMessagesToShow,
      ...this.serverErrors,
    };
  }

  @computed get isFormValid() {
    return !Object.keys(this.allValidationMessagesToShow).length;
  }

  @computed get wasChanged() {
    return this.startItem !== JSON.stringify(processObjectForModel(toJS(this.item)));
  }

  @computed get serializedItem() {
    console.log(">>>> serializeing....")
    const itemObj = toJS(this.item);
    return Object.keys(itemObj?itemObj:{}).reduce((res, key) => {
      return { ...res, [key]: itemObj[key] === null ? '' : itemObj[key] }
    }, {});
  }
}
