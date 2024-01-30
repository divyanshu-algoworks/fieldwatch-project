import { observable } from "mobx";

import ItemFormState from './ItemFormState';

export default class ResultsImportState extends ItemFormState {
   item = {
    document: '',
    hit_state: '',
    query: '',
    territory: '',
   }

  validators = {
    hit_state_id: function (item) {
      if (!item.hit_state_id) {
        return 'can\'t be blank';
      }
      return null;
    },
    query_id: function (item) {
      if (!item.query_id) {
        return 'can\'t be blank';
      }
      return null;
    },
    territory_id: function (item) {
      if (!item.territory_id) {
        return 'can\'t be blank';
      }
      return null;
    }
  }
};
