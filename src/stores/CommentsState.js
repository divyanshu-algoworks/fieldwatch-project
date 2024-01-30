import { observable, action, computed } from "mobx";
import { autobind } from 'core-decorators';

export default class CommentsState {
  @observable items = [];

  @autobind @action setComments(items) {
    this.items = items;
  }

  @autobind @action addComment(comment) {
    this.items = [...this.items, comment];
  }
}
