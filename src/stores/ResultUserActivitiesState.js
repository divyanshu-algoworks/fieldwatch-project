import { observable, action, computed } from 'mobx';
import { autobind } from 'core-decorators';
import API from '../helpers/api';

export default class ResultUserActivitiesState {
  @observable widgetsData = {};

  @observable loadingStatuses = {};

  @autobind @action setWidgetData(key, value) {
    this.widgetsData = { ...this.widgetsData, [key]: value };
  }

  @autobind @action fetchData(props) {
    this.fetchWidgetData(props);
  }

  @autobind @action setLoadingStatus(key, status) {
    this.loadingStatuses = { ...this.loadingStatuses, [key]: status };
  }

  @autobind @action fetchWidgetData({ filter }) {
    const urls = [
      {
        url: this.urls.actions_analytics_url,
        name: 'userActions',
      },
      {
        url: this.urls.average_number_of_actions_per_day_url,
        name: 'avgActionsPerDay',
      },
      {
        url: this.urls.amount_of_actions_by_days_url,
        name: 'amountOfActionsByDays',
      }
    ];

    urls.forEach(({ url, container, name }) => {
      this.setLoadingStatus(name, true);
      API.post(url, { body: { filter } }, [container]).then((res) => {
        this.setWidgetData(name, res);
        this.setLoadingStatus(name, false);
      });
    });

  }
}
