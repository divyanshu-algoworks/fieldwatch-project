import React from 'react';
import Table from 'Components/Table';
import { move } from 'Helpers/array';
import API from 'Helpers/api';
import CommonList from './index';

export default class CommonMoveList extends CommonList {
  static defaultProps = {
    ...CommonList.defaultProps,
    defaultSortColumn: 'order_position',
  }
  moveRow = (fromPosition, toPosition) => {
    this.setState({ items: move(this.state.items, fromPosition, toPosition), });
  }

  changeOrder = (id, fromPosition, toPosition) => {
    const { url, order_url } = this.props;

    API.post(
      order_url || `${url}/orders`,
      {
        body: {
          id,
          fromPosition,
          toPosition
        },
      }).then(() => this.fetchData());
  }

  get table() {
    const { items, sorting, pagination, loading} = this.state;

    return (
      <Table config={this.tableConfig} data={items} sorting={sorting}
        onSortChange={this.handleChangeSort} pagination={pagination}
        onPaginationChange={this.handleChangePagination} draggable
        onRowMove={this.moveRow} pagination={pagination} loading={loading}
        onChangeItemOrderPosition={this.changeOrder} />
    )
  }
}
