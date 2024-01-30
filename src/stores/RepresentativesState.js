import DataCheckState from './DataCheckState';
import { autobind } from 'core-decorators';
import { observable, action, computed } from 'mobx';
export default class RepresentativesState extends DataCheckState {
  @observable upline = true;
  @observable downline = true;

  @autobind @action setUpline(upline) {
    this.upline = upline;
    this.fetchData();
  }

  @autobind @action setDownline(downline) {
    this.downline = downline;
    this.fetchData();
  }

  @autobind fetchData(props) {
    if (!!this.parentRepId) {
      return super.fetchData({ ...props, ...this.childRepresentativesFilter });
    } else {
      return super.fetchData(props);
    }
  }

  @computed get childRepresentativesFilter() {
    let levels = [];
    if (!!this.downline) {
      levels.push(-1);
    }

    if (!!this.upline) {
      levels.push(1);
    }

    return {
      filter: {
        ancestry: {
          id: this.parentRepId,
          levels,
        }
      }
    }
  }

   get searchParams() {
    return this.search ? { search: this.search } : {};
  }

  @autobind getRepresentativesByIds(ids) {
    return this.items.filter(({ id }) => ids.indexOf(id) > -1);
  }

}
