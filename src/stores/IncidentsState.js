import DataCheckState from './DataCheckState';
import { autobind } from 'core-decorators';
import { observable, action, computed } from 'mobx';
export default class IncidentsState extends DataCheckState {
  localStorageKey = 'incidentsColumnVisibility';
  @observable visibleColumns = [];
  @observable columnsVisibilityDialogVisible = false;
  @autobind fetchData(props) {
    if (!!this.parentRepId) {
      super.fetchData({ ...props, ...this.filter, });
    } else {
      super.fetchData(props);
    }
  }

  @autobind isItemCheckable(item) {
    return true;
  }

  @autobind @action setVisibleColumns(columns) {
    this.visibleColumns = columns;
  }

  @autobind @action applyColumnsFilter(columns) {
    const columnIds = columns
      .filter(({ checked }) => !!checked)
      .map(({ id }) => id)
      ;

    localStorage.setItem(this.localStorageKey, JSON.stringify(columnIds));
    this.visibleColumns = columnIds;
  }

  @autobind @action setColumnsVisibilityDialogStatus(columnsVisibilityDialogVisible) {
    this.columnsVisibilityDialogVisible = columnsVisibilityDialogVisible;
  }

  @computed get filter() {
    if (!!this.parentRepId) {
      return {
        filter: {
          representatives: [this.parentRepId]
        }
      };
    }
    return {};
  }
}
