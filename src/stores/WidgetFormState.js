import { observable, action } from 'mobx';
import { autobind } from 'core-decorators';

import ItemFormState from './ItemFormState';

export default class WidgetFormState extends ItemFormState {
  @observable widgetData = []
  @observable widgetLoading = false

  @autobind @action setWidgetLoading(widgetLoading) {
    this.widgetLoading = widgetLoading;
  }

  @autobind @action setWidgetData(widgetData) {
    this.widgetData = widgetData;
  }

  validators = {
    name: function (item) {
      if (!item.name) {
        return 'can\'t be blank';
      }
      return null;
    },
    widget_type: function (item) {
      if (!item.widget_type) {
        return 'can\'t be blank';
      }
      return null;
    },
  }
}
