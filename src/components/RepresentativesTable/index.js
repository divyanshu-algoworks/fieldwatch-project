import React from 'react';
import { autobind } from 'core-decorators';
import { inject, observer } from 'mobx-react';
import ItemsList from 'Components/ItemsList';
import ActionsColumn from 'Components/Table/CommonColumns/ActionsColumn';
import Table from 'Components/Table';
import Button from 'Components/Button';
import Tooltip from 'Components/Tooltip';
import WarningDialog from 'Components/WarningDialog';

const EllipsisCell = ({ children }) => (
  <div className="d-ib mw-100p">
    <Tooltip body={children}>
      <div className="ellipsis d-ib">{children}</div>
    </Tooltip>
  </div>
);

@inject('store')
@observer
export default class RepresentativesTable extends ItemsList {
  storeName = 'RepresentativesState';

  constructor(props) {
    super(props);
    if (!!props.parentRepId) {
      this.store.parentRepId = props.parentRepId;
    }
    this.store.setSort('last_name', 'asc');
  }

  @autobind getEditItemUrl({ id }) {
    return `${this.props.representativeUrl || this.props.url}/${id}/edit`;
  }

  componentWillMount() {
    super.componentWillMount();
    this.store.destroyUrl = this.props.representativeUrl || this.props.url;
  }

  componentDidMount() {
    if (!!this.props.fetchOnMount) {
      super.componentDidMount();
    }
  }

  get tableConfig() {
    const { onSelectRelatives, onSetRootRepresentative } = this.props;
    return [
      {
        title: 'F Name',
        accessor: 'first_name',
        sortable: true,
        componentFn: (({ item }) => <EllipsisCell>{item.first_name}</EllipsisCell>),
        style: {
          maxWidth: '180px',
        },
      },
      {
        title: 'L Name',
        accessor: 'last_name',
        sortable: true,
        componentFn: (({ item }) => <EllipsisCell>{item.last_name}</EllipsisCell>),
        style: {
          maxWidth: '180px',
        },
      },
      {
        title: 'ID',
        accessor: 'rep_id',
        sortable: true,
        componentFn: (({ item }) => <EllipsisCell>{item.rep_id}</EllipsisCell>),
        style: {
          maxWidth: '100px',
        },
      },
      {
        title: 'Email',
        accessor: 'email',
        sortable: true,
        componentFn: (({ item }) => <EllipsisCell>{item.email}</EllipsisCell>),
        style: {
          maxWidth: '200px',
        },
      },
      {
        title: 'Status',
        accessor: 'rep_status',
        sortable: true,
        componentFn: (({ item }) => <EllipsisCell>{item.status}</EllipsisCell>),
        style: {
          maxWidth: '70px',
        },
      },
      {
        title: 'Top Sponsor',
        accessor: 'sponsor_rep_id',
        sortable: true,
        componentFn: (({ item }) => <EllipsisCell>{item.top_sponsor}</EllipsisCell>),
      },
      {
        title: 'I Cnt',
        accessor: 'incidents_cnt',
        sortable: true,
        componentFn: (({ item }) => item.incidents_cnt),
        style: {
          maxWidth: '20px',
        },
      },
      {
        title: 'DI Cnt',
        accessor: 'downline_incidents_cnt',
        sortable: true,
        componentFn: (({ item }) => item.downline_incidents_cnt),
        style: {
          maxWidth: '20px',
        },
      },
      {
        title: 'Actions',
        componentFn: (props) => (
          <div>
          <ActionsColumn {...props}
            getEditItemUrlFn={this.getEditItemUrl}
            onDestroy={this.store.prepareItemToDestroy}>
            {!!onSetRootRepresentative && (
              <Tooltip body="Show Organization" key="select-top"
                className="table-actions__tooltip-container">
                <Button className="table-actions__button" status="link"
                  onClick={(e) => { e.stopPropagation(); onSetRootRepresentative(props.item) }}>
                  <b className="icon icon--bold icon--button">🔝</b>
                </Button>
              </Tooltip>
            )}
            {!!onSelectRelatives && [
              (
                <Tooltip body="Select Parents" key="select-parents"
                  className="table-actions__tooltip-container">
                  <Button className="table-actions__button" status="link"
                    onClick={(e) => { e.stopPropagation(); onSelectRelatives(props.item, 'parents') }}>
                    <i className="pe-7s-up-arrow icon icon--bold icon--button"></i>
                  </Button>
                </Tooltip>
              ),
              (
                <Tooltip body="Select Children" key="select-children"
                  className="table-actions__tooltip-container">
                  <Button className="table-actions__button" status="link"
                    onClick={(e) => { e.stopPropagation(); onSelectRelatives(props.item, 'children') }}>
                    <i className="pe-7s-bottom-arrow icon icon--bold icon--button"></i>
                  </Button>
                </Tooltip>
              ),
            ]}
          </ActionsColumn>
          </div>
        )
      }
    ];
  }
  render() {
    const { itemsWithCheckInfo, isAllPageChecked, sorting, pagination, isWarningOpen,
      closeDestroyWarning, destroyItem, itemToDestroy, loading,
    } = this.store;
    return [(
      <Table config={this.tableConfig} data={itemsWithCheckInfo} sorting={sorting} key="table"
        onRowClick={this.props.onRowClick}
        showCheckPageCheckbox={this.props.showCheckPageCheckbox}
        rowClassFn={this.props.rowClassFn}
        onRowCheck={this.props.onRowCheck} isAllPageChecked={isAllPageChecked}
        onSortChange={this.handleChangeSort} pagination={pagination}
        onPaginationChange={this.handleChangePagination}
        horizontalScroll={this.props.horizontalScroll}
        loading={loading} />
    ),
    (
      <WarningDialog key="warning-dialog" isOpen={isWarningOpen}
        onClose={closeDestroyWarning} onConfirm={() => destroyItem(itemToDestroy, {filter: this.props.filter})} />
    ),
    ];
  }
}
