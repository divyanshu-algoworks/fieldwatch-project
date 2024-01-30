import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import API from '../helpers/api';

export default class AnalyticsIncidentState {
  @observable widgetsData = {
    tabStates: {},
  };

  @observable selectedFiltersList = {}
  @observable loadingStatuses = {};

  @autobind getFetchOptions({ filter } = {}) {
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
      filter: filterToFetch
    };
  }

  @autobind @action setWidgetData(key, value) {
    this.widgetsData = { ...this.widgetsData, [key]: value };
  }

  @autobind @action setFiltersList(selectedFiltersList) {
    this.selectedFiltersList = selectedFiltersList;
  }

  @autobind @action setLoadingStatus(key, status) {
    this.loadingStatuses = { ...this.loadingStatuses, [key]: status };
  }

  @autobind @action fetchWidgetData({ filter }) {
    this.incidentsWithAllActions = {};
    const urlsArr = [
      {
        url: this.urls.client_alaytics,
        name: 'clientAnalytics',
      },
      {
        url: this.urls.incidents_average_resolution_time,
        name: 'incidentsAverageResolutionTime',
      },
      {
        url: this.urls.incidents_by_category,
        name: 'incidentsByCategory',
      },
      {
        url: this.urls.incidents_by_status,
        name: 'incidentsByStatus',
      },
      {
        url: this.urls.incidents_keywords,
        name: 'incidentsKeywords',
      },
      {
        url: this.urls.incidents_trends_over_time,
        name: 'incidentsTrendsOverTime',
      },
      {
        url: this.urls.incidents_query_results_by_tabs_url,
        name: 'incidentsQueryResultsByTabs',
      }
    ];

    urlsArr.forEach(({ url, container, name }) => {
      this.setLoadingStatus(name, true);
      API.post(url, { body: { filter } }, [container]).then((res) => {
        this.setWidgetData(name, {
          data: res,
          time: new Date(),
        });
        this.setLoadingStatus(name, false);
      });
    });

  }

  @autobind @action fetchData(props) {
    this.fetchWidgetData(props);
  }
}
