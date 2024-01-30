import { observable, override } from "mobx";

import ItemFormState from './ItemFormState';

export default class QueryResultTabState extends ItemFormState {
  item = { name: '' }

  validators = {
    name: function (item) {
      if (!item.name || !item.name.length) {
        return 'can\'t be blank';
      }
      return null;
    }
  }
};
