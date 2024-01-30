import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import API from '../helpers/api';
export default class QueryLogsState {
  @observable
  widgetData = {}

  @observable
  loading = false

  @autobind @action
  fetchWidgetData(filter) {
    this.setLoading();
    API.get(this.url, { body: { ...filter } }, [])
      .then((res) => {
        this.setWidgetData(res);
        this.removeLoading();
      });
  }

  @autobind @action
  setWidgetData(data) {
    this.widgetData = data;
  }

  @autobind @action
  setLoading() {
    this.loading = true;
  }

  @autobind @action
  removeLoading() {
    this.loading = false;
  }

  @computed
  get categories() {
    if (!this.widgetData || !this.widgetData.length) {
      return [];
    }

    return this.widgetData.map((item) => item.date);
  }

  @computed
  get series() {
    if (!this.widgetData || !this.widgetData.length) {
      return [];
    }

    return [{
      name: 'New Results',
      data: this.widgetData.map((item) => [Date.parse(item.date), item.stored_as_new])
    }, {
      name: 'Duplicated Results',
      data: this.widgetData.map((item) => [Date.parse(item.date), item.duplicated_results])
    }, {
      name: 'Rejected Results',
      data: this.widgetData.map((item) => [Date.parse(item.date), item.rejected_results])
    }]

  }
}
