import { observable, action } from "mobx";
import { autobind } from 'core-decorators';

import DataState from './DataState';

export default class ActivityLogsState extends DataState {
  @observable graphData = null;

  @autobind @action setGraphData(graphData) {
    this.graphData = graphData;
  }
};
