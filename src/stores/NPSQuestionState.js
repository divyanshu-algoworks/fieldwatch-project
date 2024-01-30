import NoticeState from './NoticeState';

export default class NPSQuestionState extends NoticeState {
  clientRoles = []
  validators = {
    text: function (item) {
      const div = document.createElement('div');
      div.innerHTML = item.text;
      if (!div.innerText.trim().length) {
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
    expiration_date: function (item) {
      if (!item.expiration_date) {
        return 'Can\'t be blank'
      }
    },
  }
}
