import React, { Component } from 'react';
import { addFilterView, loadFilterView } from '../../helpers/localStorage';
import { findItemByKey, replaceItem, findItemIndexByKey, removeItem, insertItem, } from '../../helpers/array';
import Select from '../../components/Select';
import INCIDENTS_TABLE_DEFAULT_COLUMNS from '../../constants/IncidentsTableDefaultColumns';

export class FiltersViews extends Component {
  constructor(props) {
    super(props);
    let view = loadFilterView(this.props.client_id);
    const savedViews = props.views.map((view => { return { ...view, settings: JSON.parse(view.settings) } }));
    const views = view.id === 'custom' ? [...savedViews, view] : savedViews;

    // If default view is already stored in Localstorage, load it, otherwise use default settings
    const defaultView = view.name && view.name === 'All Incidents' ? view : { id: 'default', name: 'All Incidents' ,settings:{columns:INCIDENTS_TABLE_DEFAULT_COLUMNS}}

    this.state = {
      value: loadFilterView(this.props.client_id).id,
      tempValue: undefined,
      views: [
        { ...defaultView},
        ...views,
      ],
    }
  }

  handleChange = (value) => {  
    const { IncidentState, openViewUpdateDialog } = this.props;
    const isPopUpAllowed = JSON.parse(localStorage.getItem('is_popup_allowed'));
    IncidentState && !isPopUpAllowed && IncidentState.setIsFilterDropDownChanged(true);
    this.setState({ tempValue: value });
    if(IncidentState && IncidentState.isViewUpdated && !isPopUpAllowed)
      openViewUpdateDialog(this.handleChangeViewUpdate)
    else this.handleChangeViewUpdate(value)
  }

  handleChangeViewUpdate = (data) => {
    const value = data || this.state.tempValue;
    const id = isNaN(value) ? value : Number(value);
    const view = findItemByKey(this.state.views, id);
    this.setState({ value }, () => {
      this.props.filters.current.setView(view);
      addFilterView(this.props.client_id, view);
    });
  }

  addView = (view) => {
    this.setState({
      views: insertItem(this.state.views, view),
      value: view.id,
    });
  }

  updateView = (view) => {
    const viewIndex = findItemByKey(this.state.views, view.id);
    if (viewIndex === -1 || viewIndex === null) {
      this.addView(view);
    } else {
      this.setState({
        views: replaceItem(this.state.views, view),
        value: view.id,
      });
    }
  }

  changeView = (view) => {
    if (view.id === 'default') {
      view = findItemByKey(this.state.views, view.id);
    }
    const { views } = this.state;
    const index = findItemIndexByKey(views, view.id);
    const newViews = index > -1 ? replaceItem(views, view) : [...views, view];
    this.setState({ views: newViews, value: view.id, });
  }

  deleteView = ({ id }) => {
    this.setState({
      views: removeItem(this.state.views, { id }),
      value: 'default',
    });
  }

  get value() {
    return this.state.value;
  }

  get activeView() {
    return findItemByKey(this.state.views, this.state.value);
  }

  render() {
    return (
      <Select options={this.state.views} value={this.state.value}
        onChange={this.handleChange}
        triggerClassName="filters-list-select__trigger"
        optionClassName="filters-list-select__option"
        className="filters-list-select" />
    );
  }
}
