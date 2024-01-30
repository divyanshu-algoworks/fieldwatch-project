import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import Dialog from 'Components/Dialog';
import Button from 'Components/Button';
import Preloader from 'Components/Preloader';
import Tooltip from 'Components/Tooltip';
import Input from 'Components/Input';
import TablePaginator from 'Components/Table/TablePaginator';
import API from 'Helpers/api';

@inject('store')
@observer
export default class BindLinkToSingleSearchDialog extends Component {

  handleChangePagination = (pagination) => {
    const { SingleUrlQueriesState } = this.props.store;
    SingleUrlQueriesState.setPagination(pagination);
    SingleUrlQueriesState.fetchData();
  }

  handleBind = () => {
    const { url } = this.props.linkToBind;
    const { selectedQueries } = this.props.store.SingleUrlQueriesState;
    const body = {
      url,
      queries: selectedQueries.peek()
    };

    API.post(this.props.bindUrlPath, {
      body,
    }).then(this.props.onClose);
  }

  componentWillMount() {
    const { SingleUrlQueriesState } = this.props.store;
    SingleUrlQueriesState.dataUrl = this.props.singleUrlQueriesPath;
    SingleUrlQueriesState.setSort('query_name');
  }

  componentWillReceiveProps(nextProps) {
    const { store, singleUrlQueriesPath } = this.props;
    if (nextProps.isOpen && !this.props.isOpen) {
      store.SingleUrlQueriesState.setPagination({ page: 1, sizePerPage: 10 });
      store.SingleUrlQueriesState.setSelectedQueries([]);
      store.SingleUrlQueriesState.fetchData();
    }
  }

  get dialogBody() {
    const {
      items, pagination, selectQuery, selectedQueries
    } = this.props.store.SingleUrlQueriesState;

    if (!items) {
      return (<Preloader />);
    }
    return (<div className="grid">
      <div className="grid__row">
        {items.map(item => (
          <div className="grid__col grid__col--3 mb-10" key={item.id}>
            <Tooltip body={item.name} >
              <Input type="checkbox" label={item.name}
                checked={selectedQueries.indexOf(item.id) > -1}
                onChange={({ target }) => selectQuery(item.id, target.checked)} />
            </Tooltip>
          </div>
        ))}
      </div>
      <div className="grid__row">
        <div className="grid__col grid__col--12">
          <TablePaginator pagination={pagination}
            onPaginationChange={this.handleChangePagination} />
        </div>
      </div>
    </div>);
    return null;
  }

  render() {
    const { isOpen, onClose, } = this.props;
    return (
      <Dialog isOpen={isOpen} onClose={onClose}>
        <Dialog.Header onClose={onClose}>
          Bind URL to Single Search
        </Dialog.Header>
        <Dialog.Body>
          {this.dialogBody}
        </Dialog.Body>

        <Dialog.Footer>
          <Button status="black" onClick={onClose}>Close</Button>
          <Button onClick={this.handleBind}>Save</Button>
        </Dialog.Footer>
      </Dialog>
    );
  }
}
