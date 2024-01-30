import { observable, action } from "mobx";
import { autobind } from 'core-decorators';

import ItemFormState from './ItemFormState';

export default class LanguageState extends ItemFormState {
  clientRoles = []

   item = {
    saas: false,
    clients: [],
    roles: [],
    text: '',
  }

  @autobind @action changeRoles(name, value) {
    return !!value ? this.item.roles.push(name) : this.item.roles.remove(name);
  }

  validators = {
    text: function (item) {
      if (!item.text || !item.text.length) {
        return 'Can\'t be blank';
      }
      return null;
    },
    roles: function (item) {
      if (!item.roles.length) {
        return 'Can\'t be blank'
      }
    },
    clients: (item) => {
      const isClientRolesIds = this.clientRoles.map(({id}) => id);
      const isClientRolesSelected = isClientRolesIds.some(id => item.roles.indexOf(id) > -1);
      if(isClientRolesSelected && (!item.clients || !item.clients.length)) {
        return 'Can\'t be blank if client roles selected';
      }
      return null;
    },
  }
};
