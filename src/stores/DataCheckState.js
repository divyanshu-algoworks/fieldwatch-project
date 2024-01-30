import DataState from './DataState';
import { autobind } from 'core-decorators';
import { observable, action, computed } from 'mobx';
export default class DataCheckState extends DataState {
  @observable checkedItems = [];
  @observable allChecked = false;
  

  @autobind isItemCheckable() {
    return true;
  }

  @autobind @action toggleAllChecked() {
    this.checkedItems = [];
    this.allChecked = !this.allChecked;
  }

  @autobind @action setAllChecked(allChecked) {
    this.allChecked = allChecked;
  }

  @autobind isItemChecked({ id }) {
    const itemInCheckedArray = this.checkedItems.some(item => item.id === id);
    return this.allChecked
      ? !itemInCheckedArray : itemInCheckedArray;
  }

  @autobind canItemBeChecked({ id }) {
    return !this.checkedItems.length || this.checkedItems.every(item => item.id !== id);
  }

  @autobind @action handleCheckAllItems() {
    this.items.forEach(this.handleCheckItem);
  }

  @autobind @action handleUncheckAllItems() {
    this.checkedItems = this.checkedItems.filter(({ id }) => {
      return this.items.findIndex(item => item.id === id) === -1;
    });
  }

  @autobind @action handleClearCheckedItems() {
    this.checkedItems = [];
  }

  @autobind @action handleCheckItem(item) {
    if (this.canItemBeChecked(item)) {
      this.checkedItems = [...this.checkedItems, item];
    }
  }

  @autobind @action handleUncheckItem(item) {
    const itemIndex = this.checkedItems.findIndex(({ id }) => item.id === id);
    this.checkedItems = [].concat(
      this.checkedItems.slice(0, itemIndex),
      this.checkedItems.slice(itemIndex + 1),
    );
  }

  @computed get itemsWithCheckInfo() {
    if (!this.items) {
      return [];
    }
    return this.items.map(item => {
      return {
        ...item,
        checkable: this.isItemCheckable(item),
        checked: this.isItemChecked(item),
      };
    });
  }

  @computed get isAllPageChecked() {
    if (!this.items || !this.items.length) {
      return false;
    }

    return this.items.filter(this.isItemCheckable).every(this.isItemChecked);
  }
}
