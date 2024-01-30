import { observable, action } from 'mobx';
import { autobind } from 'core-decorators';
import ItemFormState from './ItemFormState';

const emptyItem = {
  body: '',
};

export default class SmsFormState extends ItemFormState {
   item = { ...emptyItem };

  @autobind setItem(item) {
    this.item = { ...emptyItem, ...item };
  }

  @autobind @action setTitle(title) {
    this.item.title = title;
  }

  @autobind @action setBody(body) {
    this.item.body = body;
  }

  validators = {
    title: function (item) {
      if (item.title === '' || item.title === null || item.title === undefined) {
        return 'сan\'t be blank';
      }

      return null;
    },
    body: (item) => {
      if (item.body === '' || item.body === null || item.body === undefined) {
        return 'can\'t be blank';
      }

      return null;
    }
  }
};
