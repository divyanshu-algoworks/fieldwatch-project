import React from 'react';
import CommonList from './index';
import Table from 'Components/Table';
import { add, removeItem, } from 'Helpers/array';

export class CommonCheckableList extends CommonList {
  state = {
    ...this.state,
    checkedItems: [],
    allChecked: false,
  }

  isItemCheckable = () => true;

  toggleAllChecked = () => this.setState({
    checkedItems: [], allChecked: !this.state.allChecked,
  });

  setAllChecked = (allChecked) => this.setState({ allChecked });

  isItemChecked = ({ id }) => {
    const { allChecked, checkedItems } = this.state;
    const itemInCheckedList = checkedItems.some(i => i.id === id);
    /* if allChecked, then checkedItems contain unchecked items */
    return allChecked ? !itemInCheckedList : itemInCheckedList;
  }

  canItemBeChecked = ({ id }) => {
    return !this.state.checkedItems.length || this.state.checkedItems.every(item => item.id !== id);
  }

  checkAllitems = () => {
    const checkedItemsIds = this.state.checkedItems.map(({ id }) => id);
    const itemsToCheck = this.state.items.filter(({ id }) => checkedItemsIds.indexOf(id) < 0);
    this.setState({ checkedItems: [...this.state.checkedItems, ...itemsToCheck] });
  }

  uncheckAllItems = () => {
    const itemsIds = this.state.items.map(({ id }) => id);
    const checkedItems = this.state.checkedItems.filter(({ id }) => itemsIds.indexOf(id) < 0);
    this.setState({ checkedItems });
  }

  clearChecked = () => this.setState({ checkedItems: [], });

  checkItem = (item) => {
    if (this.canItemBeChecked(item)) {
      this.setState({ checkedItems: add(this.state.checkedItems, item) });
    }
  }

  uncheckItem = (item) => {
    this.setState({ checkedItems: removeItem(this.state.checkedItems, item) });
  }

  toggleRowCheck = (item, selected) => {
    const selectedVal = this.state.allChecked ? !selected : selected;
    let res;
    if (item === 'all') {
      res = selectedVal ? this.checkAllitems() : this.uncheckAllItems();
    } else {
      res = selectedVal ? this.checkItem(item) : this.uncheckItem(item);
    }
    return res;
  }

  get itemsWithCheckInfo() {
    const { items } = this.state;

    if (!items) {
      return [];
    }

    return items.map(item => {
      return {
        ...item,
        checkable: this.isItemCheckable(item),
        checked: this.isItemChecked(item),
      }
    })
  }

  get isAllPageChecked() {
    const { items } = this.state;
    if (!items || !items.length) {
      return false;
    }
    return items.filter(this.isItemCheckable).every(this.isItemChecked);
  }

  get table() {
    const { pagination, sorting, loading, } = this.state;
    return (
      <div className="p-r">
        <Table config={this.tableConfig} loading={loading} data={this.itemsWithCheckInfo}
          pagination={pagination} sorting={sorting}
          keyFn={this.keyFn}
          onSortChange={this.handleChangeSort}
          onPaginationChange={this.handleChangePagination}
          isAllPageChecked={this.isAllPageChecked}
          onRowCheck={this.toggleRowCheck} />
      </div>
    );
  }
}
