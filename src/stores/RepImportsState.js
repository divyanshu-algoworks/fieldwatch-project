import { observable, action } from 'mobx';
import { autobind } from 'core-decorators';
import DataState from './DataState';

export default class RepImportsStore extends DataState {
  @observable errorReasonDialogVisible = false;
  @observable invalidDialogVisible = false;
  @observable itemToPreview = {};

  @autobind @action changeErrorReasonDialogVisibility(errorReasonDialogVisible, itemToPreview = {}) {
    this.errorReasonDialogVisible = errorReasonDialogVisible;
    this.itemToPreview = itemToPreview;
  }

  @autobind @action changeInvalidDialogVisibility(invalidDialogVisible, itemToPreview = {}) {
    this.invalidDialogVisible = invalidDialogVisible;
    this.itemToPreview = itemToPreview;
  }
}
