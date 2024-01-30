import { observable, action, toJS } from "mobx";
import { autobind } from 'core-decorators';
import serializeFiltersViewSettings from '../helpers/serializeFiltersViewSettings';
import API from '../helpers/api';
import ItemFormState from './ItemFormState';

const emptyView = { name: '', public: false };

export default class FilterViewState extends ItemFormState {
  url = '';
   item = { ...emptyView };
  @observable isDialogOpen = false;

  @autobind @action openDialog(itemToEdit = { ...emptyView }) {
    this.item = itemToEdit;
    this.isDialogOpen = true;
  }

  @autobind @action closeDialog() {
    this.isDialogOpen = false;
  }

  @autobind sendData(onSuccess) {
    const method = this.item.id ? 'put' : 'post';
    const url = this.item.id ? `${this.url}/${this.item.id}` : this.url;
    return API[method](url, {
      body: {
        is_public: this.item.is_public,
        filter_settings: {
          name: this.item.name,
          settings: serializeFiltersViewSettings(toJS(this.item.settings)),
        },
      },
    }).then((res) => {
      if (!!onSuccess) {
        onSuccess(res, method);
      }
    });
  }

  validators = {
    name: function (item) {
      if (!item.name || !item.name.length) {
        return 'can\'t be blank';
      }
      return null;
    }
  }
};
