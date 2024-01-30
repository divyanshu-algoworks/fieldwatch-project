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

export default class EmailFormState extends ItemFormState {
   item = { ...emptyItem };
  @observable isSubjectRequired = false;
  @observable isBodyRequired = false;


  @observable preview = null;

  @autobind setItem(item) {
    this.item = { ...emptyItem, ...item };
    if (!this.item.subject) {
      this.item.subject = '';
    }

    if (!this.item.body) {
      this.item.body = '';
    }

  }

  @autobind @action setPreview(preview) {
    this.preview = preview;
  }

  @autobind @action setRequiredFields(isSubjectRequired = false, isBodyRequired = false) {
    this.isSubjectRequired = isSubjectRequired;
    this.isBodyRequired = isBodyRequired;
  }

  @autobind @action resetForm() {
    this.item = { ...emptyItem };
    this.isFormSubmitted = false;
  }
  validators = {
    title: function (item) {
      if (item.title === '' || item.title === null || item.title === undefined) {
        return 'can\'t be blank';
      }
      return null;
    },
    from_name: function (item) {
      if (item.from_name === '' || item.from_name === null) {
        return 'can\'t be blank';
      }
      return null;
    },

    subject: (item) => {
      if (this.isSubjectRequired && item.subject === '') {
        return 'can\'t be blank';
      }
      return null;
    },

    body: (item) => {
      if (this.isBodyRequired && item.body === '') {
        return 'can\'t be blank';
      }
      return null;
    }
  }
};
