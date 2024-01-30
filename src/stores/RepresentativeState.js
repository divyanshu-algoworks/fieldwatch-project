import { observable, action, computed, toJS } from 'mobx';
import { autobind } from 'core-decorators';
import ItemFormState from './ItemFormState';

export default class RepresentativeState extends ItemFormState {
  groupsUrl = '';
  // United states, brazil, colombia, mexico, canada
  countryIdsWithStates = [236, 32, 49, 144, 40];
   item = {
    groups: [],
    repIdRequired: true,
  };
  @observable existRepresentative = null;
  @observable autocompleteOptions = null;
  @observable groups = [];

  @autobind @action setRepIdRequired(value) {
    this.item.repIdRequired = value;
  }

  @autobind @action setAutocompleteOptions(autocompleteOptions) {
    this.autocompleteOptions = autocompleteOptions;
  }

  @autobind @action setExistRepresentative(existRepresentative) {
    if (!existRepresentative || !existRepresentative.id) {
      this.existRepresentative = null;
    } else {
      this.existRepresentative = existRepresentative;
    }
  }

  @autobind @action setSelectedGroups(groups) {
    this.item.groups = groups;
  }

  @autobind @action setGroups(groups) {
    this.groups = groups;
  }

  @autobind @action addGroupToList(group) {
    if (!group) {
      return;
    }
    const existGroup = this.groups.find(({ id }) => group.id === id);
    if (!!existGroup) {
      return;
    }
    this.groups = [...this.groups.peek(), group];
  }

  @autobind changeValue(key, value) {
    super.changeValue(key, value);
    if (key === 'country') {
      this.item = {
        ...this.item,
        us_state_id: null,
      };
    }
  }

  @computed get isStateSelectEnabled() {
    return (
      !!this.item &&
      !!this.item.country &&
      this.countryIdsWithStates.includes(this.item.country.id)
    );
  }

  @autobind @action updateSponsorEmail(sponsorEmail) {
    this.item = {...this.item, sponser_rep_email: sponsorEmail}
  }

  validators = {
    first_name: function (item) {
      if (!item.first_name || !item.first_name.length) {
        return "can't be blank";
      }
      return null;
    },
    last_name: function (item) {
      if (!item.last_name || !item.last_name.length) {
        return "can't be blank";
      }
      return null;
    },
    rep_id: function (item) {
      if (item.repIdRequired && (!item.rep_id || !item.rep_id.length)) {
        return "can't be blank";
      }
      return null;
    },
    sponsor_rep_id: function(item) {
      console.log('> sponsor present '+ item)
      if(item.sponser_rep_email && !item.sponsor_rep_id) {
        return "can't be blank"
      }
    }
  };
}
