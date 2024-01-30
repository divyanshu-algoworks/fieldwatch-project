import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import IconButton from 'Components/IconButton';
import Button from 'Components/Button';
import Input from 'Components/Input';
import Table from 'Components/Table';
import API from 'Helpers/api';
import Paper from 'Components/Paper';
import Preloader from 'Components/Preloader';
import { CommonCheckableList } from 'Components/CommonList/CommonCheckebleList';
import { FW_ADMIN_WARNING_MSG } from "Constants/NonFWClientWarningMessage";
import {getClientType } from 'Helpers/cookie';
import { updateItem, } from 'Helpers/array';

export default class QueriesList extends CommonCheckableList {
  static propTypes = {
    newBtnText: PropTypes.string,
    showRunPause: PropTypes.bool,
    showRun: PropTypes.bool,
    showUpdate: PropTypes.bool,
    showLogs: PropTypes.bool,
    showClone: PropTypes.bool,
    showDestroy: PropTypes.bool,
    showSQ: PropTypes.bool,
  };

  static defaultProps = {
    ...CommonCheckableList.defaultProps,
    showRunPause: true,
    showUpdate: true,
    showDestroy: true,
    showSQ: false,
    defaultSortColumn: 'query_name',
    defaultPerPage: 50,
    fetchMethod: 'get',
  }

  hasCheckFunctionality = false;

  title = 'Query List';
  newBtnText = 'New Query';
  handleToggleQueryRunning = ({ id, on_hold }) => {
    this.setState({ items: updateItem(this.state.items, id, { loading: true }) });
    API.put(`${this.props.url}/${id}/change_state`).then(() => {
      const items = updateItem(this.state.items, id, { on_hold: !on_hold, loading: false });
      this.setState({ items });
    });
  }

  get playColumn() {
    return {
      title: 'Play/Pause',
      style: {
        width: '80px',
      },
      acessor: 'on_hold',
      componentFn: ({ item }) => {
        const handleClick = () => this.handleToggleQueryRunning(item);
        if (!!item.loading) {
          return (<Preloader small />);
        }
        return (
          <div className="query-status" onClick={handleClick}>
            <div className={classnames('query-status__icon', { 'query-status__icon--active': !item.on_hold })}></div>
          </div>
        );
      },
    };
  }

  get queryNameColumn() {
    return {
      title: 'Query Name',
      sortable: true,
      accessor: 'query_name',
      componentFn: ({ item }) => <a href={`${this.props.hits_url}?query_id=${item.id}`}>{item.name}</a>,
    };
  }

  get statusColumn() {
    const { url,current_user_role } = this.props;
    return {
      title: 'Status',
      style: {
        width: '100px',
      },
      componentFn: ({ item }) => {
        if (!!item.on_hold) {
          return (<strong className="c-orange">Stopped</strong>)
        }
        return (<strong className="c-blue">Running</strong>);
      }
    };
  }

  get actionsColumn() {
    return {
      title: 'Actions',
      style: {
        width: '150px',
      },
      componentFn: this.actionsCoulumnComponent,
    };
  }

  get tableConfig() {
    return [
      this.queryNameColumn,
      this.statusColumn,
      this.actionsColumn,
    ];
  }

  editBtn = (item) => {
    return !!item.can_update && (
      <IconButton tooltip="Edit Record" icon="pe-7s-note"
        href={`${this.props.url}/${item.id}/edit`} />
    );
  }

  destroyBtn = (item) => {
    return !!item.can_destroy && (
      <IconButton tooltip="Destroy Query" icon="pe-7s-close-circle"
        onClick={() => this.setItemToRemove(item)} />
    );
  }

  get table() {
    if (!!this.hasCheckFunctionality) {
      return super.table;
    }

    const { items, pagination, sorting, loading, } = this.state;

    return (
      <Table config={this.tableConfig} loading={loading} data={items}
        pagination={pagination} sorting={sorting}
        keyFn={this.keyFn}
        onSortChange={this.handleChangeSort}
        onPaginationChange={this.handleChangePagination} />
    );
  }

  render() {
    const { items, } = this.state;
    const {current_user_role, hits_url, features} = this.props;
    if(!features.query_ability_enabled && !current_user_role.includes('fw_admin')) {
      return (
        <Paper>
          <Paper.Body>
            <div className="ta-c mt-20 mb-20">
              <h4 className="mb-30">You are not authorised to see this page.</h4>
              <Button type="link" href={hits_url}>
                Go to Results Page
              </Button>
            </div>
          </Paper.Body>
        </Paper>
      )
    }
    
    return (
      <React.Fragment>
      {['fc'].includes(getClientType('fw_client_type')) && (
        <h4 className="non-fw-warning">
        {FW_ADMIN_WARNING_MSG}
        </h4>
      )}
      <Paper>
        <Paper.Header>
          <Paper.Title small>
            {this.title}&nbsp;
            <strong className="muted">({items.length})</strong>
          </Paper.Title>
          <div className="d-f" style={{ alignItems: 'center', }}>
            <Input type="search" value={this.state.search}
              onChange={this.handleChangeSearch} />
            <Button type="link" id="btn-new" size="big" className="ml-10"
              href={`${this.props.url}/new`}>
              <span className="glyphicon glyphicon-plus"></span>
              &nbsp;{this.newBtnText}
            </Button>
            {this.headerAddonControls}
          </div>
        </Paper.Header>
        <Paper.Body>
          {this.table}
          {this.warningDialog}
        </Paper.Body>
      </Paper>
      </React.Fragment>
    );
  }
}

