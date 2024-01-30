import { observable, action, computed } from "mobx";
import { autobind } from 'core-decorators';
import API from '../helpers/api';

export default class DataState {
  request = null;
  hidePreloader = false;
  fetchMethod = 'get'
  dataKey = null;
  @observable items = null;
  @observable loading = false;
  @observable pagination = {
    page: 1,
    sizePerPage: 50,
    recordsFiltered: 0,
    recordsTotal: 0
  };
  @observable search = '';
  @observable sorting = {
    sortColumn: 'name',
    sortDirection: 'asc'
  };
  @observable isWarningOpen = false;
  @observable itemToDestroy = null;

  dataUrl = '';
  // TODO: config async await
  @autobind @action fetchData(params) {
    const dataKey = this.dataKey;
    const body = {
      ...this.paginationParams,
      ...this.sortingParams,
      ...this.searchParams,
      ...params
    };
    this.setLoading(true);
    if (!!this.request) {
      this.request.abort();
    }
    this.request = API[this.fetchMethod](`${this.dataUrl}.json`, { body });
    this.request.then((res) => {
      let data, recordsFiltered, recordsTotal;
      this.request = null;
      if (dataKey) {
        data = res[dataKey].data;
        recordsFiltered = res[dataKey].recordsTotal;
        recordsTotal = res[dataKey].recordsTotal;
      } else {
        data = res.data;
        recordsFiltered = res.recordsTotal;
        recordsTotal = res.recordsTotal;
      }
      this.setItems(data);
    {/*Show only 1000 results at MAX on hits page FW-842*/}
    //console.log(body[filter][hit_state][values].includes("null"),"the body");
      if(this.dataUrl.endsWith("/hits") && !!body.filter && !!body.filter.hit_state
      && !!body.filter.hit_state.values && body.filter.hit_state.values.includes("null")){
        if(recordsFiltered>1000){
          recordsFiltered=1000;
        }
        if(recordsTotal>1000){
          recordsTotal=1000;
        }
      }
    {/*Show only 1000 results at MAX on hits page Fw-842*/}

      this.setPagination({ recordsFiltered, recordsTotal });
      this.setLoading(false);
    });
    return this.request;
  }

  @autobind @action changeSearch(value) {
    this.search = value;
  }

  @autobind getItemIndex(item) {
    return this.items.findIndex(({ id }) => item.id === id);
  }

  @autobind @action destroyItem(item, additionParamsToFetch = {}, url = `${this.destroyUrl || this.dataUrl}/${item.id}`) {
    const request = API.delete(url);
    request.then(({ flash_type, redirect }) => {
      if (!!redirect) {
        window.location.href = redirect;
      }
      this.closeDestroyWarning();
      if (flash_type !== 'success') {
        return;
      }
      if (this.pagination.recordsFiltered === 1) {
        this.setPagination({ page: Math.max(this.pagination.page - 1, 1) })
      }
      this.fetchData(additionParamsToFetch);
    });
    return request;
  }

  @autobind @action handleChangeItemOrderPosition(id, fromPosition, toPosition) {
    return API.post(
      `${this.dataUrl}/orders`,
      {
        body: {
          id,
          fromPosition,
          toPosition
        },
      }).then(() => {
        this.fetchData();
      });
  }

  @autobind @action moveRow(fromPosition, toPosition) {
    let newItems;

    if (fromPosition > toPosition) {
      newItems = [
        ...this.items.slice(0, toPosition),
        this.items[fromPosition],
        ...this.items.slice(toPosition, fromPosition),
        ...this.items.slice(fromPosition + 1)
      ];
    } else {
      newItems = [
        ...this.items.slice(0, fromPosition),
        ...this.items.slice(fromPosition + 1, toPosition + 1),
        this.items[fromPosition],
        ...this.items.slice(toPosition + 1)
      ];
    }
    this.setItems(newItems);
  }

  @autobind @action removeItemFromStore(item) {
    this.items.remove(item);
  }

  @autobind @action setSort(sortColumn, sortDirection = 'asc') {
    this.sorting = {
      sortColumn,
      sortDirection
    }
  }

  @autobind @action disableSort() {
    this.sorting = {};
  }

  @autobind @action setPagination(newPagination) {
    this.pagination = { ...this.pagination, ...newPagination };
  }

  @autobind @action setItems(items) {
    this.items = items;
  }

  @autobind @action setLoading(status) {
    this.loading = status;
  }

  @autobind @action prepareItemToDestroy(item) {
    this.isWarningOpen = true;
    this.itemToDestroy = { ...item };
  }

  @autobind @action closeDestroyWarning() {
    this.isWarningOpen = false;
  }

  @computed get sortingParams() {
    const { sortColumn, sortDirection } = this.sorting;
    // if(sortColumn === 'rep_status'){
    //   return { sort_column: 'status', sort_direction: sortDirection };
    // }
    return { sort_column: sortColumn, sort_direction: sortDirection };
  }

  @computed get paginationParams() {
    const { page, sizePerPage } = this.pagination;
    return { size_per_page: sizePerPage, page };
  }

  @computed get searchParams() {
    return this.search ? { search: { value: this.search } } : {};
  }
}
