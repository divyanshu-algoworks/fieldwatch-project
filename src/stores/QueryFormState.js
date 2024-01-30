import { observable } from "mobx";

import ItemFormState from './ItemFormState';

export default class TerritoryState extends ItemFormState {
   item = { name: '', territory: {}, brand: '' }

  validators = {
    name: function (item) {
      if (!item.name || !item.name.length) {
        return 'can\'t be blank';
      }
      return null;
    },
    territory: function (item) {
      if (!item.territory) {
        return 'can\'t be blank';
      }
      return null;
    },
    brands: function (item) {
      if (!item.brands || !item.brands.length) {
        return 'can\'t be blank';
      }
      return null;
    },
  }
};
