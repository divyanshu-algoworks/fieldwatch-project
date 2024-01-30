import { observable, action } from "mobx";
import { autobind } from 'core-decorators';

export default class FilesListStore {
  @observable items = [];

  @autobind @action setItems(items) {
    this.items = items;
  }

  @autobind @action add(item) {
    this.items = [...this.items, item];
  }

  @autobind @action unbind(fileId) {
    const index = this.items.findIndex(({ id }) => id === fileId);
    this.items = [
      ...this.items.slice(0, index),
      { ...this.items[index], _destroy: true },
      ...this.items.slice(index + 1)
    ];
  }

  @autobind @action bind(item, oldItem) {
    const index = this.items.findIndex(({ id }) => id === oldItem.id);

    if (index < 0) {
      this.items = [...this.items, item];
    } else {
      this.items = [
        ...this.items.slice(0, index),
        { ...item, name: oldItem.name },
        ...this.items.slice(index + 1)
      ];
    }
  }

  @autobind @action rebind(itemId) {
    const index = this.items.findIndex(({ id }) => id === itemId);
    if (index < 0) {
      return;
    }
    const { _destroy, progress, name, id, url } = this.items[index];
    this.items = [
      ...this.items.slice(0, index),
      { name, id, url },
      ...this.items.slice(index + 1)
    ];
  }

  @autobind @action changeProgress(newProgress, item) {
    const index = this.items.findIndex(({ id }) => item.id === id);
    if (index < 0) {
      return;
    }

    const { progress, name, id, url } = this.items[index];
    const newitem = typeof newProgress === 'number' ? { name, id, url, progress: newProgress } : { name, id, url };
    this.items = [
      ...this.items.slice(0, index),
      newitem,
      ...this.items.slice(index + 1)
    ];
  }
}
