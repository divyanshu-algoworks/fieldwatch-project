import DataState from './DataState';
import { autobind } from 'core-decorators';
import { action, observable } from "mobx";

export default class SingleUrlQueriesState extends DataState {
  @observable selectedQueries = [];

  @autobind @action setSelectedQueries(selectedQueries) {
    this.selectedQueries = [...selectedQueries];
  }

  @autobind @action selectQuery(id, checked) {
    if (checked) {
      this.selectedQueries.push(id);
    } else {
      this.selectedQueries.remove(id);
    }
  }
}
