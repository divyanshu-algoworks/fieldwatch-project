import { observable, action, computed, toJS } from 'mobx';
import { autobind } from 'core-decorators';
import { FILTER_PARAMS } from '../constants/FilterParams';
import prepareFilters from '../helpers/prepareFilters';

function transformFiltersToServerFormat(filtersData) {
  return toJS(Object.keys(filtersData).reduce((res, key) => {
    const currentFilter = toJS(filtersData[key]);
    if (FILTER_PARAMS[key].type === 'checklist') {
      const arr = currentFilter
        .filter(({ checked }) => checked)
        .map(({ id }) => id);
      res[key] = arr.length ? arr : [''];
    } else {
      res[key] = currentFilter;
    }
    return res;
  }, {}));
}

export default class FiltersState {
  @observable filtersData = {};
  @observable dateRanges = {};
  @autobind @action setFilters({ data_ranges, data_short_ranges, autocomplete_urls, ...filters }, initialValues,time_default) {
    const { ...resFilters } = prepareFilters(filters, initialValues,time_default);
    this.initialFilters = { ...resFilters };
    this.filtersData = resFilters;
    this.dateRanges = data_ranges;
    this.dateShortRanges = data_short_ranges;
    this.autocompleteUrls = autocomplete_urls;
  }

  @autobind @action clearFilters(additionalFiltersValues) {
    this.filtersData = { ...this.initialFilters, ...additionalFiltersValues };
  }

  @autobind @action changeFilter(filterName, value) {
    this.filtersData = { ...this.filtersData, [filterName]: value };
  }

  @autobind @action setFilterData(filter, option, checked = false) {
  }

  @autobind @action addFilterData(filter, option, checked = true) {
    this.initialFilters[filter] = [...this.initialFilters[filter], { ...option, checked }];
    this.filtersData[filter] = [...this.filtersData[filter], { ...option, checked }];
  }

  @computed get filters() {
    return Object.keys(this.filtersData).reduce((res, key) => {
      res[key] = toJS(this.filtersData[key]);
      return res;
    }, {});
  }

  @computed get changedFilters() {
    const changedNames = Object.keys(this.initialFilters)
      .filter(filterName => {
        if (FILTER_PARAMS[filterName].type === 'checklist') {
          const checkedItems = this.filtersData[filterName].filter(({ checked }) => !!checked);
          return checkedItems.length !== this.filtersData[filterName].length;
        }
        if (FILTER_PARAMS[filterName].type === 'edgecase') {
          return this.filtersData[filterName].length !== 2;
        }
        if (FILTER_PARAMS[filterName].type === 'daterange') {
          return (
            (this.initialFilters[filterName].type !== this.filtersData[filterName].type) ||
            (this.initialFilters[filterName].field !== this.filtersData[filterName].field)
          );
        }
        if (FILTER_PARAMS[filterName].type === 'representative') {
          return !!this.filtersData[filterName] && !!this.filtersData[filterName].id;
        }
        return false;
      });

    return changedNames.reduce((res, name) => {
      res[name] = this.filtersData[name];
      return res;
    }, {});
  }

  @computed get filtersToFetch() {
    return transformFiltersToServerFormat(this.filtersData);
  }

  @computed get changedFiltersToFetch() {
    return transformFiltersToServerFormat(this.changedFilters);
  }

  @computed get wasFiltersSelected() {
    return Object.keys(this.filtersData).some(key => {
      const filter = this.filtersData[key];
      if (!!filter.type) {
        return filter.type !== 'all_period'
      }
      const checkedFilters = filter.filter(({ checked }) => !!checked);
      return checkedFilters.length !== filter.length;
    });
  }
}
