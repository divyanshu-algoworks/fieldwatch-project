import ItemFormState from './ItemFormState';
import { observable, action } from 'mobx';
export default class SendTrainingDialogState extends ItemFormState {
  @observable activeView = 'list';
  @observable emails = [];

  @action setActiveView(activeView, item = {}) {
    this.activeView = activeView;
    this.item = item;
  }

  @action setEmails(emails) {
    this.emails = emails;
  }
}
