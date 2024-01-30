import { observable, action, computed, toJS } from 'mobx';
import { autobind } from 'core-decorators';

import { DEFAULT_VIEW_ID, CUSTOM_VIEW_ID, CUSTOM_VIEW_TITLE, ANALYTICS_INCIDENT_VIEW_KEY } from '../constants/FiltersViews';
import prepareFilters from '../helpers/prepareFilters';
import FiltersState from './FiltersState';
import {
  saveFiltersViewToLocalStorage,
  loadFiltersViewFromLocalStorage,
} from '../helpers/filtersView';
import API from '../helpers/api';

export default class AnalyticsIncidentFiltersState extends FiltersState {
  clientId = null;
  viewsUrl = '';
  @observable views = [];
  @observable selectedView = null;
  @observable isFiltersVisible = false;

  @autobind @action selectView(selectedView) {
    this.selectedView = selectedView;

    saveFiltersViewToLocalStorage(selectedView, this.clientId, ANALYTICS_INCIDENT_VIEW_KEY);
  }

  @autobind @action prepareViews(views) {
    this.views = views;
    const { selectedView } = loadFiltersViewFromLocalStorage(this.clientId, ANALYTICS_INCIDENT_VIEW_KEY);
    if (!!selectedView && selectedView.id !== DEFAULT_VIEW_ID) {
      this.selectedView = selectedView;
    } else {
      const defaultView = views.filter(({ id }) => id === DEFAULT_VIEW_ID)[0];
      this.selectedView = defaultView;
    }
    if (!!selectedView && selectedView.id === CUSTOM_VIEW_ID) {
      this.views = [...views, selectedView];
    } else if (!!selectedView) {
      const index = views.findIndex(({ id }) => id === selectedView.id);
      this.views = [].concat(
        views.slice(0, index),
        selectedView,
        views.slice(index + 1),
      );
    }
  }

  @autobind setFilters({ data_ranges, data_short_ranges, autocomplete_urls, ...filters }, initialValues) {
    const { ...resFilters } = prepareFilters(filters, initialValues);
    this.initialFilters = { ...resFilters };
    this.filtersData = resFilters;
    if (!!initialValues.reported_incidents_filter) {
      this.filtersData.reported_incidents_filter = initialValues.reported_incidents_filter;
    }
    this.dateRanges = data_ranges;
    this.dateShortRanges = data_short_ranges;
    this.autocompleteUrls = autocomplete_urls;
  }

  @autobind @action toggleFiltersVisibility() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  @autobind clearFilters() {
    this.filtersData = { ...this.initialFilters };
  }

  @autobind changeFilter(filterName, value) {
    super.changeFilter(filterName, value);
    let newView = { ...this.selectedView, settings: this.filtersToFetch, id: CUSTOM_VIEW_ID, name: CUSTOM_VIEW_TITLE };
    if (this.selectedView.id === DEFAULT_VIEW_ID) {
      this.selectView(newView);
      const index = this.views.findIndex(({ id }) => id === newView.id);
      if (index > -1) {
        this.updateView(newView);
      } else {
        this.views = [...this.views.peek(), newView];
      }
    } else {
      saveFiltersViewToLocalStorage(newView, this.clientId, ANALYTICS_INCIDENT_VIEW_KEY);
    }
  }

  @autobind @action addView(view) {
    this.views.push(view);
  }

  @autobind @action updateView(view) {
    const index = this.views.findIndex(({ id }) => id === view.id);
    this.views = [].concat(
      this.views.slice(0, index),
      view,
      this.views.slice(index + 1),
    );
  }

  @autobind @action deleteView(view) {
    const viewsArr = this.views.peek();
    const index = viewsArr.findIndex(({ id }) => id === view.id);
    this.views = [].concat(viewsArr.slice(0, index), viewsArr.slice(index + 1));
    const defaultView = this.views.filter(({ id }) => id === DEFAULT_VIEW_ID)[0];
    this.selectView(defaultView);
  }

  @autobind destroyView(view) {
    if (view.id === CUSTOM_VIEW_ID) {
      this.deleteView(view);
    } else {
      API.delete(`${this.viewsUrl}/${view.id}`)
        .then(() => this.deleteView(view))
        ;
    }
  }

   get filters() {
    return Object.keys(this.filtersData).reduce((res, key) => {
      res[key] = toJS(this.filtersData[key]);
      return res;
    }, {});
  }

   get wasFiltersSelected() {
    return Object.keys(this.filtersData).some(key => {
      const filter = this.filtersData[key];
      if (!!filter.type) {
        return filter.type !== 'all_period'
      }
      const checkedFilters = filter.filter(({ checked }) => !!checked);
      return checkedFilters.length !== filter.length;
    });
  }

  @computed get defaultFiltersView() {
    return this.views.filter(({ id }) => id === DEFAULT_VIEW_ID)[0];
  }

  @computed get canUpdateSelectedView() {
    return [DEFAULT_VIEW_ID, CUSTOM_VIEW_ID].indexOf(this.selectedView.id) === -1;
  }

  @computed get canDestroySelectedView() {
    return this.selectedView.id !== DEFAULT_VIEW_ID;
  }
}
