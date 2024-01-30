import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import API from '../../helpers/api';

/**
 * ItemsList is component with common functionality for pages with items tables,
 * pagination and create button.
 */
export default class ItemsList extends Component {
  storeName = 'DataState';
  static defaultProps = {
    fetchOnMount: true,
  }

  componentWillMount() {
    this.store.dataUrl = this.props.urlToFetch || this.props.url;
    this.store.destroyUrl = this.props.destroyUrl || this.props.url;
  }

  get params() {
    const params = !!this.props.filter ? { filter: this.props.filter } : {};

    return params;
  }

  /**
   * When component mounted, we will fetch data to display
   */
  componentDidMount() {
    if (!!this.props.fetchOnMount) {
      this.store.fetchData(this.params);
    }
  }

  /**
   * build url of create item page
   */
  @autobind getNewItemUrl() {
    const { url } = this.props;
    return `${url}/new`;
  }


  /**
   * build order for change order by drag-n-drop
   */
  @autobind getChangeOrderUrl() {
    const { url, order_url } = this.props;
    return order_url || `${url}/orders`;
  }

  /**
   * build url of edit item page
   */
  @autobind getEditItemUrl(item) {
    const { url } = this.props;
    return `${url}/${item.id}/edit`;
  }


  /**
   * build url for destroy item ajax request
   */
  @autobind getDestroyItemUrl(item) {
    const { url } = this.props;
    return `${url}/${item.id}`;
  }

  /**
   * Change sorting handler
   * @param {string} column column accessoor
   * @param {string} direction sorting direction
   */
  @autobind handleChangeSort(column, direction) {
    this.store.setSort(column, direction);
    this.store.fetchData(this.params);
  }

  /**
   * Handler for change page& Will set page to state and send request for data
   * displaying
   * @param {object} pagination pagination object
   */
  @autobind handleChangePagination(pagination) {
    this.store.setPagination(pagination);
    this.store.fetchData(this.params);
  }

  /**
   * Handler to change search input value. It will update value and re-fetch data
   * @param {string} newSearch new value for search input
   */
  @autobind handleChangeSearch(newSearch) {
    this.store.changeSearch(newSearch);
    this.store.setPagination({ page: 1 });
    this.store.fetchData(this.params);
  }


  /**
   * Handler for change item order position by drag-n-drop. When we drop item,
   * then will send ajax request for changing order position, then items will
   * fetch one more time
   * @param {number} id Row item id
   * @param {number} fromPosition old item position
   * @param {number} toPosition new item position
   */
  @autobind handleChangeOrder(id, fromPosition, toPosition) {
    API.post(
      this.getChangeOrderUrl(),
      {
        body: {
          id,
          fromPosition,
          toPosition
        },
      }).then(this.store.fetchData);
  }

  get store() {
    return this.props.store[this.storeName]
  }

}
