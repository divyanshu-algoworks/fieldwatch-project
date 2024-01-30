import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import API from '../helpers/api';
import timeFromObjectToString from '../helpers/timeFromObjectToString';

export default class IncidentUserActivitiesState {
  @observable pagination = {
    page: 1,
    sizePerPage: 10,
  };

  @observable widgetsData = {
    tabStates: {},
  };

  @observable incidentsWithAllActions = {};

  @observable tableData = {};

  @observable loadingStatuses = {};

  @autobind getFetchOptions({ page, sizePerPage, filter } = {}) {
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
      sizePerPage: sizePerPage || this.pagination.sizePerPage,
      filter: filterToFetch
    };
  }

  @autobind @action setWidgetData(key, value) {
    this.widgetsData = { ...this.widgetsData, [key]: value };
  }

  @autobind @action setTableData({ data, recordsTotal }) {
    this.tableData = data;
    this.pagination = { ...this.pagination, recordsTotal };
  }

  @autobind @action updateIncident(incident, user_activities) {
    this.incidentsWithAllActions[incident.id] = true;
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

  @autobind @action fetchWidgetData({ filter }) {
    this.incidentsWithAllActions = {};
    const urlsArr = [{
      url: this.urls.statistics_url,
      name: 'tabStates',
    },
    {
      url: this.urls.average_number_of_actions_per_day_url,
      name: 'avgNumberOfActions',
    },
    {
      url: this.urls.amount_of_actions_by_days_url,
      name: 'amountOfActionsByDays',
    },
    {
      url: this.urls.avg_time_between_actions_by_incident_url,
      name: 'avgTimeBetweenActionByIncident',
    },
    {
      url: this.urls.avg_time_between_actions_by_user_url,
      name: 'avgTimeBetweenAction',
    },
    {
      url: this.urls.actions_analytics_url,
      name: 'userActions',
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

  @autobind @action fetchTableData({ page, sizePerPage, filter }) {
    this.incidentsWithAllActions = {};
    this.setLoadingStatus('table', true);
    API.post(this.urls.table_data_url, {
      body: {
        filter,
        page,
        size_per_page: sizePerPage,
      },
    }, []).then((table) => {
      this.setTableData(table);
      this.setLoadingStatus('table', false);
    });
  }

  @autobind @action fetchData(props) {
    this.fetchWidgetData(props);
    this.fetchTableData(props);
  }

  @computed get tabStates() {
    const { data } = this.widgetsData.tabStates;
    if (!data || !Object.keys(data).length) {
      return [];
    }
    return [
      { title: 'Total Actions', value: data.total_actions },
      { title: 'AVG Time Between Actions', value: timeFromObjectToString(data.average_time_between_actions) },
      { title: 'Incidents Created', value: data.created_incidents_count },
      { title: 'Incidents Closed', value: data.closed_incidents_count },
      { title: 'Incidents Updated', value: data.updated_incidents_count },
    ];
  }

}
