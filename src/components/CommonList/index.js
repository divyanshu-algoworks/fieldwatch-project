import React, { Component, createRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import Table from '../../components/Table';
import TablePaginator from '../../components/Table/TablePaginator';
import IconButton from '../../components/IconButton';
import WarningDialog from '../../components/WarningDialog';
import PAGINATION from '../../constants/Pagination';
import API from '../../helpers/api';
import GAEvents from '../../constants/GAEvents';
export default class CommonList extends Component {
  static propTypes = {
    fetchMethod: PropTypes.oneOf(["get", "post"]),
    defaultSortColumn: PropTypes.string,
    defaultPerPage: PropTypes.number,
    initialState: PropTypes.object,
    onSuccessFetch: PropTypes.func,
    hasPagination: PropTypes.bool,
  };

  static defaultProps = {
    fetchMethod: "get",
    defaultSortColumn: "client_name",
    defaultPerPage: 50,
    hasPagination: true,
  };
  fetchOnMount = true;
  filters = createRef();
  warning = createRef();

  constructor(props) {
    super(props);
    this.dataUrl = props.urlToFetch || props.url;
    this.destroyUrl = props.destroyUrl || props.url;
    this.state = {
      itemToRemove: null,
      items: [],
      loading: true,
      ...(props.hasPagination && {
        pagination: {
          page: 1,
          sizePerPage: !!props.admin_user_activities_url
            ? 10
            : props.defaultPerPage,
          recordsFiltered: 0,
          recordsTotal: 0,
        },
      }),
      sorting: {
        sortColumn: props.defaultSortColumn,
        sortDirection: "asc",
      },
      search: "",
      ...props.initialState,
    };
    this.fetchData = this.fetchData.bind(this);
    this.getEditBtn = this.getEditBtn.bind(this);
    this.getDestroyBtn = this.getDestroyBtn.bind(this);
    this.serializeData = this.serializeData.bind(this);
    this.handleChangeSort = this.handleChangeSort.bind(this);
    this.getRequestBody = this.getRequestBody.bind(this);
  }

  componentDidMount() {
    if (this.fetchOnMount) {
      this.fetchData();
      this.fetchOnMount = false;
    }
  }

  getRequestBody(params) {
    let body = {
      ...this.sortingParams,
      ...this.paginationParams,
      search: this.state.search ? { value: this.state.search } : undefined,
      ...params,
    };
    if (!!this.filters.current) {
      body.filter = this.filters.current.serialize();
    }

    return body;
  }

  fetchData(params) {
    console.log(this.getUrl());
    let stopInitialFetchReqForAllTimeFilter;
    if (!!this.props.admin_user_activities_url) {
      const filter = this.filters.current.serialize();
      stopInitialFetchReqForAllTimeFilter = filter.created_at_range.type == "all_period";
    }
    if (!stopInitialFetchReqForAllTimeFilter) {
      const request = API[this.props.fetchMethod](this.getUrl(), {
        body: this.getRequestBody(params),
      });
      request.then(({ data }) => {
        if (!!this.props.onSuccessFetch) {
          this.props.onSuccessFetch(data);
        }
        this.setState({
          items: data.data,
          pagination: {
            ...this.state.pagination,
            recordsTotal: data.recordsTotal,
            recordsFiltered: data.recordsFiltered,
          },
          loading: false,
        });
      });
      this.setState({ loading: true });
      return request;
    } else {
      this.setState({
        items: [],
        pagination: {
          ...this.state.pagination,
          recordsTotal: 0,
          recordsFiltered: 0,
        },
        loading: false,
      });
    }
  }

  handleChangeSort(sortColumn, sortDirection = "asc") {
    this.setState({ sorting: { sortColumn, sortDirection } }, () =>
      this.fetchData()
    );
  }

  handleChangePagination = (pagination) =>
    this.setState(
      { pagination: { ...this.state.pagination, ...pagination } },
      () => this.fetchData('pagination')
    );

  setItemToRemove = (itemToRemove) => {
    this.setState({ itemToRemove });
    if (!!this.warning && !!this.warning.current) {
      this.warning.current.open();
    }
  };
  handleCancelDelete = () => this.setState({ itemToRemove: null });
  handleSubmitRemove = () => {
    const url =
      this.state.itemToRemove.destroy_url ||
      `${this.destroyUrl || this.dataUrl}/${this.state.itemToRemove.id}`;
    let user = this.props.current_user
      ? this.props.current_user
      : this.props.current_user_role;
    if (!!user && !!user.id) {
      GAEvents.commonDelete(this.props.analytics_key, url, user.id);
    }
    return API.delete(url).then(() => {
      this.setState({ itemToRemove: null });
      this.warning.current.close();
      this.fetchData();
    });
  };

  handleChangeSearch = ({ target }) => {
    this.setState(
      {
        search: target.value,
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.fetchData()
    );
  };

  handleChangeView = (params) => {
    this.fetchData(params);
  };

  getEditBtn(item) {
    return (
      <IconButton
        tooltip="Edit Record"
        icon="pe-7s-note"
        href={`${this.props.url}/${item.id}/edit`}
      />
    );
  }

  getDestroyBtn(item) {
    return (
      <IconButton
        tooltip="Destroy Record"
        icon="pe-7s-close-circle"
        onClick={() => this.setItemToRemove(item)}
      />
    );
  }

  getCloneBtn(item) {
    return (
      <IconButton
        tooltip="Clone Training"
        icon="pe-7s-copy-file"
        href={`${this.props.url}/${item.id}/clone`}
      />
    );
  }

  serializeData({ data, recordsTotal, recordsFiltered }) {
    return {
      items: data,
      pagination: { ...this.state.pagination, recordsTotal, recordsFiltered },
      loading: false,
    };
  }

  get paginationParams() {
    if (!this.props.hasPagination) {
      return null;
    }
    const { page, sizePerPage } = this.state.pagination;
    return { size_per_page: sizePerPage, page };
  }

  get sortingParams() {
    const { sortColumn, sortDirection } = this.state.sorting;
    return { sort_column: sortColumn, sort_direction: sortDirection };
  }

  get warningDialog() {
    return (
      <WarningDialog
        ref={this.warning}
        onConfirm={() => {
          return this.handleSubmitRemove(this.state.itemToDestroy);
        }}
      />
    );
  }

  get pagination() {
    const { pagination } = this.state;
    return (
      pagination.recordsTotal > PAGINATION.SIZES[0] && (
        <div
          className="fw-table__paginatior-container"
          key="pagination-container"
        >
          <TablePaginator
            pagination={pagination}
            onPaginationChange={this.handleChangePagination}
            hidePaginationChanger={!!this.props.admin_user_activities_url} 
          />
        </div>
      )
    );
  }

  get table() {
    const { items, sorting, loading } = this.state;

    return (
      <Fragment>
        <Table
          config={this.tableConfig}
          loading={loading}
          data={items}
          sorting={sorting}
          keyFn={this.keyFn}
          onSortChange={this.handleChangeSort}
          horizontalScroll={!!this.horizontalScroll}
        />
        {this.pagination}
      </Fragment>
    );
  }

  get actionsColumn() {
    return {
      title: "Actions",
      style: {
        width: "100px",
      },
      componentFn: ({ item }) => (
        <div className="table-actions">
          {this.getEditBtn(item)}
          {this.getDestroyBtn(item)}
        </div>
      ),
    };
  }
}
