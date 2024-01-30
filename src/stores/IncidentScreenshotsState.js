import { observable, action } from "mobx";
import { autobind } from 'core-decorators';

import FilesListState from './FilesListState';
export default class IncidentScreenshotsState extends FilesListState {
  @observable imageToMagnify = {};

  @autobind @action setImageToView(img) {
    this.imageToMagnify = img;
  }
}
