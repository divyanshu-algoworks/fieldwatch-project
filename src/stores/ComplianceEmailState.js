import { observable, action } from 'mobx';
import { autobind } from 'core-decorators';

import ItemFormState from './ItemFormState';

const emptyItem = {
  include_attachments: false,
  subject: '',
  body: '',
  cc: '',
  include_files: false
};

export default class ComplianceEmailState extends ItemFormState {
   item = { ...emptyItem };
  @observable preview = null;

  @autobind setItem(item, replyAttrs) {
    this.item = { ...emptyItem, ...item };
  }

  @autobind @action setPreview(preview) {
    this.preview = preview;
  }

  @autobind @action resetForm() {
    this.item = { ...emptyItem };
    this.isFormSubmitted = false;
  }
};
