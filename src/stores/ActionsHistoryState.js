import DataState from './DataState';
import { autobind } from 'core-decorators';
import { action, observable } from "mobx";
import API from '../helpers/api';

export default class ActionsHistoryState extends DataState {

  @observable loader = true;

  @autobind fetchData() {
    API.get(this.dataUrl).then(({ user_activities }) => {
      this.setItems(user_activities);
      this.setLoader(false);
    });
  }

  @autobind @action setLoader(status) {
    this.loader = status;
  }

  @autobind @action updateAction(action) {
    const index = this.items.findIndex(({ id }) => action.id === id);
    this.items = [].concat(
      this.items.slice(0, index),
      [action],
      this.items.slice(index + 1)
    );
  }
}
