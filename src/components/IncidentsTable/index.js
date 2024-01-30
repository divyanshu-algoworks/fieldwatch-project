import React from 'react';
import { autobind } from 'core-decorators';
import { inject, observer } from 'mobx-react';
import ItemsList from 'Components/ItemsList';
import Table from 'Components/Table';
import ColumnsVisibilityDialog from 'Components/ColumnsVisibilityDialog';
import INCIDENTS_TABLE_DEFAULT_COLUMNS from 'Constants/IncidentsTableDefaultColumns';
import Tooltip from 'Components/Tooltip';
import WarningDialog from "Components/WarningDialog";
import Button from 'Components/Button';
import { ActionsColumn, EllipsisCell } from 'Components/Table/CommonColumns';
import API from 'Helpers/api';
import {addFilterView, loadFilterView} from 'Helpers/localStorage';
import {FiltersWithView, transformViewToOldFormat} from 'Components/Filters/FiltersWithView';
import { getClientType } from 'Helpers/cookie';

function getVisibleColumnsList() {
  let list;
  try {
    // TODO: change config localStorage data format
    list = JSON.parse(localStorage.incidentsColumnVisibility);
  } catch (err) {
    list = INCIDENTS_TABLE_DEFAULT_COLUMNS;
  }

  return list;
}

@inject('store')
@observer
export default class IncidentsTable extends ItemsList {
  storeName = 'IncidentsState'
  constructor(props) {
    super(props);
    this.state = {
      isArchiveWarningOpen: false,
      selectedIncident: {},
    }
    this.store.setVisibleColumns(getVisibleColumnsList());
    props.showActionColumn ? this.store.setSort('reported_date', 'desc') 
    : this.store.setSort('reminder_date', 'asc');
    this.store.fetchMethod = 'post';

    this.onChangeColumns = this.onChangeColumns.bind(this);
  }

   showArchiveIcon (){
    const selectedFilter = loadFilterView(this.props.client_id);
    const { fromRep, systemGenerated } = this.props;
    return localStorage.getItem('current_tab') === 'main' &&  selectedFilter && selectedFilter.name !== 'All Field Submissions' && !fromRep && !systemGenerated
  } 
   showUnArchiveIcon (){
    const selectedFilter = loadFilterView(this.props.client_id);
    const { fromRep, systemGenerated } = this.props;
   return localStorage.getItem('current_tab') === 'archived' &&  selectedFilter && selectedFilter.name !== 'All Field Submissions' && !fromRep && !systemGenerated
 } 

 getIncidentLinksFilter = () => {
  const currentFilters = this.props.filter;
  const incidenLink = currentFilters && currentFilters.incident_links;
  const incidentLinkFilters = this.props.filters.incident_links;
  if (!incidenLink) return {
    direct_select: false,
    values: []
  }
  const { values, direct_select } = incidenLink;
  if (((values.includes('all_links_resolved') || values.includes('no_links')) && values.length == 1 && direct_select) || 
       (direct_select && values.length == 2 && values.includes('all_links_resolved') && values.includes('no_links'))) {
    return {
      direct_select: false,
      values: values
    }
  }
  else if (!direct_select) {
    const finalValues = [];
     incidentLinkFilters.map(({ id} ) => {
      !values.includes(id) && finalValues.push(id);
    })
    return {
     direct_select: true,
     values: finalValues
    }
 }
  else return incidenLink;
 }

  getItemKey(item) {
    return item.incident_id ? item.id : `fs-${item.id}`;
  }

  @autobind getPreviewItemUrl({ incident_id, id }) {
    if (!!incident_id) {
      return null;
    }
    return `${this.props.reportedIncidentsUrl}/${id}`;
  }

  @autobind getEditItemUrl({ id, incident_id, publish, read_only, submission_name, client_id }) {
    const { openIncidentUrl, showActionColumn, editIncidentUrl } = this.props;
    if(editIncidentUrl) return `${editIncidentUrl}/${client_id}/incidents/${id}/edit`;
    if(!showActionColumn) return `${openIncidentUrl}/${id}/edit`;
    if(!read_only && ['fc'].includes(getClientType()))  return `${this.props.itemUrl}/${id}`;
    if (!incident_id && submission_name ) {
      return `${this.props.reportedIncidentsUrl}/${id}`;
    }
    return `${this.props.itemUrl}/${id}/edit`;
  }

  @autobind async archiveIncident() {
   const {selectedIncident} = this.state;
   await API.put(`${this.props.itemUrl}/${selectedIncident.id}/toggle_archive`, {
      body: {incident:{
        ...selectedIncident,
        archived: this.showArchiveIcon()
      }}
     })
    this.setState({ isArchiveWarningOpen: false}, () => {
      FW.flash({ type: 'info', text: `Incident ${this.showArchiveIcon() ?'Archived': 'Unarchived' } Successfully!`});
      const { filter, onRowCheck } = this.props;
      onRowCheck &&  onRowCheck('all', false);
      this.store.fetchData({
        filter: {
        ...filter,
        incident_links: this.getIncidentLinksFilter(),
        archived: {
           direct_select: true,
           values: [this.showUnArchiveIcon()]
        }
      }
     });
    })
  }

  componentDidMount() {
    localStorage.setItem("markAsNonViolated", false);
    const current_tab = localStorage.getItem('current_tab');
    const { filter, fromRep, systemGenerated, isRecentTab, isAllResolvedSelected } = this.props;
    const isFilterEmpty = JSON.stringify(filter) === '{}'
    isRecentTab && this.store.setSort('updated_date', 'desc');
    if (!!this.props.fetchOnMount) {
      this.store.fetchData({ 
        filter: (!fromRep && !isFilterEmpty) ? {
          ...filter, 
          incident_links: this.getIncidentLinksFilter(),
          archived: {
             direct_select: true,
             values:[current_tab === 'archived']
          }
        }: filter,
        system_generated: (current_tab === "systemGenerated") || systemGenerated,
        non_violant: current_tab === "nonViolated", 
        client_id: this.props.client_id,
        with_resolved: isAllResolvedSelected,
        recent: this.props.recent
      });
    }
  }

  @autobind handleChangeSort(column, direction) {
    const { filter, fromRep, systemGenerated, isAllResolvedSelected } = this.props;
    const current_tab = localStorage.getItem('current_tab');
    const isFilterEmpty = JSON.stringify(filter) === '{}'
    this.store.setSort(column, direction);
    this.store.fetchData({ 
      filter: (!fromRep && !isFilterEmpty) ? {
        ...filter,
        incident_links: this.getIncidentLinksFilter(),
        archived: {
           direct_select: true,
           values:[current_tab === 'archived']
        }
      }: filter,
      system_generated: current_tab === "systemGenerated" || systemGenerated,
      non_violant: current_tab === "nonViolated", 
      client_id: this.props.client_id,
      with_resolved: isAllResolvedSelected,
      recent: this.props.recent
    });
  }

  @autobind handleChangePagination(pagination) {
    const current_tab = localStorage.getItem('current_tab');
    const { isAllResolvedSelected, client_id } = this.props;
    const isFilterEmpty = JSON.stringify(filter) === '{}'
    this.store.setPagination(pagination);
    this.store.fetchData({
      filter: !isFilterEmpty ?{
         ...this.props.store.AnalyticsIncidentFiltersState.filtersToFetch, 
        ...this.props.filter,
        incident_links: this.getIncidentLinksFilter(),
        archived: {
          direct_select: true,
          values: [current_tab === 'archived']
       } 
      }: this.props.filter,
      system_generated: current_tab === "systemGenerated" || this.props.systemGenerated,
      non_violant: current_tab === "nonViolated",
      client_id: client_id,
      with_resolved: isAllResolvedSelected,
      recent: this.props.recent
    });
  }

  get tableConfig() {
    const client_type = getClientType()
    const { systemGenerated } = this.props;
    return [
      {
        title: 'Created Date',
        accessor: 'created_date',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.created_date} disabled={['fc'].includes(client_type) && item.read_only}>
              <a href={this.getEditItemUrl(item)}>{item.created_date} </a>
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Reported Date',
        accessor: 'reported_date',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.reported_date} disabled={['fc'].includes(client_type) && item.read_only}>
              <a href={this.getEditItemUrl(item)}>{item.reported_date} </a>
            </EllipsisCell>
          );
        },
      },
      {
        title: 'First Action Date',
        accessor: 'first_action_date',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.first_action_date}>
              <a href={this.getEditItemUrl(item)}>{item.first_action_date}</a>
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Post Date',
        accessor: 'post_date',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.post_date}>
              <a href={this.getEditItemUrl(item)}>{item.post_date}</a>
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Resolved Date',
        accessor: 'resolved_date',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.resolved_date}>
              {item.resolved_date}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Last Modified',
        sortable: true,
        accessor: 'updated_date',
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.updated_date}>
              {item.updated_date}
            </EllipsisCell>
          );
        },
      },
      {
        title: (['systemGenerated', 'nonViolated'].includes(this.props.currentTab) || systemGenerated) ? 'Temporary Incident ID': 'Incident Number',
        accessor: 'incident_number',
        componentFn: ({ item }) => {
          let content, tooltip;
          if (item.submission_name) {
            const text = item.submission_name || 'Field Submission';
            content = (<b className="c-orange">{text}</b>)
            tooltip = text;
          }
          else if (item.incident_id || item.id) {
            content = tooltip = (['systemGenerated', 'nonViolated'].includes(this.props.currentTab) || systemGenerated) ? item.id : item.incident_id;
          }
          return (
            <EllipsisCell tooltip={tooltip}>
              {content}
            </EllipsisCell>
          );
        },
        sortable: true,
      },
      {
        title: 'Status',
        accessor: 'status_name',
        sortable: true,
        componentFn: ({ item }) => {
          let content, tooltip;
          if (!!item.status_name) {
            content = tooltip = item.status_name;
          } else {
            const text ='';
            content = (<b className="c-orange">{}</b>)
            tooltip = text;
          }
          return (
            <EllipsisCell tooltip={tooltip}>
              {content}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Links',
        accessor: 'first_link',
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.first_link} disabled={['fc'].includes(client_type)}>
              <a href={item.first_link_full} target="_blank">{item.first_link}</a>
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Rep Name',
        accessor: 'rep_name',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.rep_name}>
              {item.rep_name}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Rep Country',
        sortable: true,
        accessor: 'rep_country',
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.rep_country}>
              {item.rep_country}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Rep Rank',
        accessor: 'rep_rank',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.rep_rank}>
              {item.rep_rank}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Rep Join Date',
        sortable: true,
        accessor: 'rep_join_date',
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.rep_join_date}>
              {item.rep_join_date}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Rep Notes',
        accessor: 'rep_additional_notes',
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.rep_additional_notes}>
              {item.rep_additional_notes}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Category',
        sortable: true,
        accessor: 'category_name',
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.category_name}>
              {item.category_name}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Risk Level',
        accessor: 'risk_level',
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.risk_level_name}>
              {item.risk_level_name}
            </EllipsisCell>
          );
        },
        sortable: true,
      },
      {
        title: 'Owner',
        accessor: 'owner',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.owner}>
              {item.owner}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Edge Case',
        accessor: 'edge_case',
        sortable: true,
        style: {
          textAlign: 'center',
        },
        componentFn: ({ item }) => {
          return (
            <div className={item.edge_case ? 'edge-case-check-icon' : ''}></div>
          );
        },
      },
      {
        title: 'Follow Up',
        accessor: 'follow_up',
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.follow_up}>
              {item.follow_up}
            </EllipsisCell>
          );
        },
        sortable: true,
      },
      {
        title: 'Compliance Actions',
        accessor: 'compliance_action_option_name',
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.compliance_action_option_name}>
              {item.compliance_action_option_name}
            </EllipsisCell>
          );
        },

      },
      {
        title: 'Offender',
        accessor: 'offender',
        sortable: false,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip="If rep has more than 1 assigned incident" disabled={true}>
              <a href="#">{item.offender}</a>
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Language',
        accessor: 'language',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.language}>
              {item.language}
            </EllipsisCell>
          );
        },
      },
      {
        title: 'Company Name',
        accessor: 'company_name',
      },
      this.props.showActionColumn ? {
        title: 'Actions',
        accessor: 'actions',
        style: {
          width: '70px',
        },
        componentFn: (props) => (
          <ActionsColumn {...props}
            getEditItemUrlFn={this.getEditItemUrl}
            getArchiveUrlFn={() => this.setState({isArchiveWarningOpen: true, selectedIncident: props.item})}
            showArchiveIcon={this.showArchiveIcon()}
            showUnArchiveIcon={this.showUnArchiveIcon()}
            client_type = {getClientType()}
            >
            {/* {!props.item.incident_id && (
              <Tooltip body="Show Incident" className="table-actions__tooltip-container">
                <Button className="table-actions__button" type="link" status="link"
                  href={this.getPreviewItemUrl(props.item)}>
                  <i className="pe-7s-folder icon icon--bold icon--button"></i>
                </Button>
              </Tooltip>
            )} */}
          </ActionsColumn>
        )
      }
      : 
      {
        title: 'Reminder Date',
        accessor: 'reminder_date',
        sortable: true,
        componentFn: ({ item }) => {
          const displayRed = new Date(item.reminder_date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
          const haveResolvedDate = !!item.resolved_date;
          return (
            <EllipsisCell tooltip={item.reminder_date}>
              <span className={`${displayRed ? 'c-red' : ''}`}>{haveResolvedDate ? '' : item.reminder_date}</span>
            </EllipsisCell>
          );
        },
      },
      !this.props.showActionColumn ? {
        title: 'Last Compliance Email / SMS',
        accessor: 'last_compliance_email_or_sms',
        sortable: true,
        componentFn: ({ item }) => {
          return (
            <EllipsisCell tooltip={item.last_compliance_email_or_sms}>
              {item.last_compliance_email_or_sms}
            </EllipsisCell>
          );
        }, 
      }: {},
    ];
  }

  onChangeColumns = (columns) => {
    const columnIds = columns
      .filter(({ checked }) => !!checked)
      .map(({ id }) => id);
    const activeView = this.props.filtersViews && this.props.filtersViews.current ? 
                       this.props.filtersViews.current.activeView
                       : loadFilterView(this.props.client_id); 

    if(activeView.id === 'default' || activeView.id === "custom"){
      const newView = {
        id: activeView.id,
        name: activeView.name,
        settings: {
          ...activeView.settings,
          columns: columnIds
        }
      }

      this.store.applyColumnsFilter(columns);
      this.store.setColumnsVisibilityDialogStatus(false);
      addFilterView(this.props.client_id, transformViewToOldFormat(newView));
      this.props.filtersViews &&  this.props.filtersViews.current &&this.props.filtersViews.current.updateView(newView);
      return;
    }

    const updatedView = {
      ...activeView,
      entity_type: 'incident',
      settings: {
        ...activeView.settings,
        columns: columnIds,
      },
    }
    API.put(`${this.props.filter_settings_url}/${activeView.id}`, {
      body: {'filter_setting': updatedView}
    }).then((data) => {
      if(!!data.errors){

      }else{
        this.store.applyColumnsFilter(columns);
        const view = {
          ...data.view, 
          settings: JSON.parse(data.view.settings)
        }
        addFilterView(this.props.client_id, transformViewToOldFormat(view));
        this.props.filtersViews.current.updateView(view);
        this.store.setColumnsVisibilityDialogStatus(false);
      }
    })
  }

  render() {
    const { itemsWithCheckInfo, isAllPageChecked, sorting, pagination, loading, visibleColumns } = this.store;
    return [(
      <Table config={this.tableConfig} data={itemsWithCheckInfo}
        keyFn={this.getItemKey}
        sorting={sorting} key="table" isAllPageChecked={isAllPageChecked}
        onSortChange={this.handleChangeSort} pagination={pagination}
        horizontalScroll visibleColumns={visibleColumns.peek()}
        onPaginationChange={this.handleChangePagination}
        onRowCheck={this.props.onRowCheck}
        loading={loading} />
    ),
    (
      <ColumnsVisibilityDialog key="columns-visibility-dialog"
        header="Choose Columns to show"
        isOpen={this.store.columnsVisibilityDialogVisible}
        allColumns={this.tableConfig}
        onClose={() => this.store.setColumnsVisibilityDialogStatus(false)}
        onChange={this.onChangeColumns}
        notCloseOnApply={true}
        visibleColumns={this.store.visibleColumns} />
    ),
    <WarningDialog
        key="warning-dialog"
        isOpen={this.state.isArchiveWarningOpen}
        text={`Are you sure you want to ${this.showArchiveIcon() ? 'archive': 'Unarchive'} this incident?`}
        onClose={() => this.setState({isArchiveWarningOpen: false })}
        onConfirm={this.archiveIncident}
      />,
    ];
  }
}
