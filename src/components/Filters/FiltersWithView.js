import React, { createRef, } from 'react';
import Button from '../../components/Button';
import QuestionMark from '../../components/QuestionMark';
import API from '../../helpers/api';
import { addFilterView, loadFilterView, deleteFilterView, } from '../../helpers/localStorage';
import { FilterViewDialog } from './ViewDialog';
import { Filters } from './List';
import { DATE_RANGE_TYPES } from '../../constants/DateRangeTypes';
import {getVisibleColumnsList} from '../../components/Filters/ViewDialog';
import {getRepStatesFilterValues} from '../../helpers/filtersView';
import { getClientType } from '../../helpers/cookie'

const dateRangeTypes = Object.keys(DATE_RANGE_TYPES);

export function transformViewToOldFormat(view) {
  dateRangeTypes.forEach(field => {
    if (!!view.settings[`${field}_range`]) {
      view.settings.date_range = { ...view.settings[`${field}_range`], field, };
      delete view.settings[`${field}_range`];
    }
  });
  return view;
}
export class FiltersWithView extends Filters {
  static defaultProps = {
    ...Filters.defaultProps,
    views: [],
  }
  dialog = createRef();

  constructor(props) {
    super(props);
    let view = loadFilterView(this.props.client_id);
    if (view.id === 'default') {
      const { date_ranges, date_short_ranges, ...filters } = props.filters;
      view.settings = this.values;
    } else {
      view.settings = Object.keys(view.settings).reduce((res, key) => {
        if (dateRangeTypes.indexOf(`${key}_range`) > -1) {
          return { ...res, date_range: { date_range: { ...view.settings[key], field: key.replace('_range', '') } } }
        }
        return { ...res, [key]: view.settings[key] }
      }, {});
    }
    let rep_states = getRepStatesFilterValues(view.settings.rep_countries, props.rep_states, true);
    this.state = {
      ...this.state,
      values: this.setFilters({ ...props.filters, rep_states, initialValues: view.settings,time_default:props.time_default }),
      viewId: view.id,
    }
  }

  onFilterChange() {
    const { IncidentState } = this.props
    if(IncidentState){
      IncidentState.setIsUpdatedView(this.changed);
      IncidentState.setUpdateViewCallback(this.updateView);
    }
    super.onFilterChange();
    if (this.props.showViewsButtons) {
      const activeView = this.props.filtersViews.current.activeView;
      if (this.changed) {
        const view = {
          id: activeView.id === "default" ? "custom" : activeView.id,
          name: activeView.id === "default" ? "Custom" : activeView.name,
          ...(activeView.user_id && { user_id: activeView.user_id }),
          settings: {
            ...this.values,
            columns: getVisibleColumnsList(),
          },
        };

        addFilterView(this.props.client_id, view);
        this.props.filtersViews.current.changeView(view);
        this.setState({ viewId: view.id });
      } else {
        deleteFilterView(this.props.client_id);
        this.setState({ viewId: "default" });
        this.props.filtersViews.current.changeView({ id: "default" });
      }
    }
  }

  createView = () => {
    this.dialog.current.open();
  }

  updateView = () => {
    this.dialog.current.open(this.props.filtersViews.current.activeView);
  }

  setView = (view) => {
    if (view.id === 'default') {
      deleteFilterView(this.props.client_id);
    } else {
      view = transformViewToOldFormat(view);
    }
    this.setState({ values: this.getValuesFromView(view), viewId: view.id },()=>{this.props.onChange(view)});
  }

  getValuesFromView = (view) => {
    if (view.id === 'default') {
      return this.setFilters({...this.props.filters,time_default:this.props.time_default});
    }
    let rep_states = getRepStatesFilterValues(view.settings.rep_countries, this.props.rep_states, true);
    return this.setFilters({ ...this.props.filters, rep_states, initialValues: view.settings,time_default:this.props.time_default });
  }

  onUpdateView = (view) => {
    addFilterView(this.props.client_id, transformViewToOldFormat(view));
    this.setState({ viewId: view.id });
    this.props.filtersViews.current.updateView(view);
  }

  destroyView = () => {
    const { viewId } = this.state;
    if (!isNaN(viewId)) {
      API.delete(`${this.props.api_url}/${viewId}`);
    }
    this.setView({ id: 'default' });
    this.props.filtersViews.current.deleteView({ id: viewId });
  }

  render() {
    const { viewId } = this.state;
    const client_type =  getClientType();

    if (!this.state.isOpen) {
      return null;
    }
    return (
      <div className="grid">
        <div className="grid__row">
          {this.filtersDom}
        </div>
        {this.props.showViewsButtons &&(
          <div className="mb-10">
          <Button size="small" className={`mr-10 ${['fc'].includes(client_type) ? 'disabled_element' : ''}`} status="black"
            onClick={this.destroyView} disabled={viewId === 'default'}>
            Delete Current View
          </Button>
          <Button size="small" className={`mr-10 ${['fc'].includes(client_type) ? 'disabled_element' : ''}`} status="black" disabled={isNaN(viewId)}
            onClick={this.updateView}>
            Update Current View
          </Button>
          <Button size="small" className={`mr-10 ${['fc'].includes(client_type) ? 'disabled_element' : ''}`} onClick={this.createView}>
            Save New View
          </Button>
          <QuestionMark tooltip="Click ‘Save New View’ to create a new view with the current filters that you can access anytime. You can also change the filters and click ‘Update View’ to update a view, or click ‘Delete’ to delete the selected view." />
        </div>

        )}
        <FilterViewDialog ref={this.dialog} url={this.props.api_url}
          onUpdateView={this.onUpdateView}
          user_id={this.props.user_id}
          filters={this.values} 
          IncidentState={this.props.IncidentState}
          />
      </div>
    )
  }
}
