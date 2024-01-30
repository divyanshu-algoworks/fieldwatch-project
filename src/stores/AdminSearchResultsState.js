import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import API from '../helpers/api';

import arrayOfObjectToObjectOfArrays from '../helpers/arrayOfObjectToObjectOfArrays';
export default class AdminSearchResultsState {
  @observable pagination = {
    page: 1,
    sizePerPage: 10,
  };

  @observable widgetsData = {
    tabStates: {},
  };

  @observable tabsData = {};

  @observable loadingStatuses = {};

  @autobind getFetchOptions({ page, size_per_page, filter } = {}) {
    const filtersMerge = { ...filter };
    const filterToFetch = Object.keys(filtersMerge).reduce((res, key) => {
      if (filtersMerge[key].length !== undefined) {
        const keyValuesArr = filtersMerge[key]
          .filter(({ checked }) => !!checked)
          .map(({ id }) => id);
        res[key] = keyValuesArr.length ? keyValuesArr : [''];
      } else {
        res[key] = filtersMerge[key];
      }
      return res;
    }, {});
    return {
      page: page || this.pagination.page,
      size_per_page: size_per_page || this.pagination.size_per_page,
      filter: filterToFetch
    };
  }

  @autobind @action setWidgetData(key, value) {
    const date = new Date();
    this.widgetsData = { ...this.widgetsData, [key]: { value, date: date.getTime() } };
  }

  @autobind @action setTableData({ data, recordsTotal }) {
    this.tableData = data;
    this.pagination = { ...this.pagination, recordsTotal };
  }

  @autobind @action updateIncident(incident, user_activities) {
    const index = this.tableData.findIndex(({ id }) => id === incident.id);
    if (index === -1) {
      return;
    }
    this.tableData = [].concat(
      this.tableData.slice(0, index),
      { ...this.tableData[index], user_activities },
      this.tableData.slice(index + 1),
    )
  }

  @autobind @action setPagination(pagination) {
    this.pagination = { ...this.pagination, ...pagination };
  }

  @autobind @action setLoadingStatus(key, status) {
    this.loadingStatuses = { ...this.loadingStatuses, [key]: status };
  }

  @autobind @action setTabs(data) {
    this.tabsData = data;
  }

  @autobind fetchTabs({ filter }) {
    this.setLoadingStatus('tabStates', true);
    API.post(this.urls.statistics_url, { body: { filter } }, [])
      .then(res => {
        this.setLoadingStatus('tabStates', false);
        this.setTabs(res);
      });
  }

  @autobind @action fetchWidgetData({ filter }) {
    const id = filter.queries.values[0];
    this.setLoadingStatus(id, true);
    API.post(this.urls.count_by_days_url, { body: { filter } }, [])
      .then((res) => {
        const objArr = arrayOfObjectToObjectOfArrays(res);
        this.setWidgetData(id, {
          categories: objArr.date,
          series: [
            { name: 'Stored as new', data: objArr.stored_as_new },
            { name: 'Duplicated results', data: objArr.duplicated_results },
            { name: 'Rejected results', data: objArr.rejected_results },
          ]
        });
        this.setLoadingStatus(id, false);
      });
  }

  @autobind @action fetchData(props) {
    this.fetchWidgetData(props);
  }

  @computed get tabStates() {
    if (!this.tabsData || !Object.keys(this.tabsData).length) {
      return [];
    }

    return [
      { title: 'Returned Results', value: this.tabsData.returned_results, },
      { title: 'Stored As New', value: this.tabsData.stored_as_new, },
      { title: 'Duplicated Results', value: this.tabsData.duplicated_results, },
      { title: 'Rejected Results', value: this.tabsData.rejected_results, },
    ];
  }

}
