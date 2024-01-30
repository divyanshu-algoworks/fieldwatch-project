import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Filter from '../../components/Filter';
import { FILTER_PARAMS } from '../../constants/FilterParams';
import Button from '../../components/Button';
import prepareFilters from '../../helpers/prepareFilters';
import { LIFETIMERANKS, ALTERNATE_RANKS} from '../../constants/LifeTimeRanksIds';
import { getRepStatesFilterValues, isShowRepStatesFilter } from '../../helpers/filtersView';
import { isEmpty } from '../../helpers/object';
import { getClientType } from '../../helpers/cookie'

export class Filters extends Component {
  static propTypes = {
    filtersNames: PropTypes.arrayOf(PropTypes.string),
    autocompleteUrls: PropTypes.object,
    onChangeFilters: PropTypes.func,
    showClearBtn: PropTypes.bool,
    openByDefault: PropTypes.bool,
  };

  static defaultProps = {
    autocompleteUrls: {},
    showClearBtn: true,
    openByDefault: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.openByDefault,
      values: this.setFilters({
        ...props.filters,
        time_default: props.time_default,
      }),
      isLifeTimeRankIds: LIFETIMERANKS.LIFETIMERANKSIDS.some(element => window.location.href.includes(element)),
      isAlternateRankIds: ALTERNATE_RANKS.ALTERNATE_RANK_IDS.some(element => window.location.href.includes(element)),
    };
    this.onFilterChange = this.onFilterChange.bind(this);
  }

  changeFilter = (name, value, callback = this.onFilterChange, addnParam) => {

    const newValues = {
      ...this.state.values,
      [name]: value
    }

    if(name === 'rep_countries'){
      if(isShowRepStatesFilter(value)){
        newValues['rep_states'] = getRepStatesFilterValues(value, this.props.rep_states);
      }else{
        delete newValues.rep_states;
      } 
    }
    
    this.setState(
      { values: newValues },
      callback
    );
  };

  updateRepGroupsFilter = (newGroup) => {
    this.setState({
      values: {
        ...this.state.values,
        representative_groups: [
          ...this.state.values['representative_groups'],
          newGroup,
        ],
      },
    });
  };

  onFilterChange() {
    this.props.onChange();
  }

  clear = () => {
    if (!!this.props.onClear) {
      return this.props.onClear();
    }

    this.setState({ values: this.defaultFilters }, () => {
      if (!!this.props.onChange) {
        this.props.onChange();
      }
    });
  };

  toggleFiltersVisibility = () => this.setState({ isOpen: !this.state.isOpen });

  get filtersDom() {
    const { filtersNames, autocompleteUrls, showStatesFilter} = this.props;
    const { values, isLifeTimeRankIds, isAlternateRankIds } = this.state;
    const client_type = getClientType();
    const filtersList = [...filtersNames];
    if(showStatesFilter && isShowRepStatesFilter(values.rep_countries)){
      filtersList.push('rep_states');
    }
    if(isLifeTimeRankIds || isAlternateRankIds) {
      const index = filtersList.findIndex(item => item ==='rep_ranks')
      filtersList.splice(index+1, 0,'additional_rep_ranks')
    }

    const filtersToDisplay = filtersList.filter((name) => {
      if (
        FILTER_PARAMS[name].type === 'checklist' &&
        (!values[name] || !values[name].length)
      ) {
        return false;
      } else if (
        FILTER_PARAMS[name].type === 'radiolist' &&
        (!values[name] || !values[name].length)
      ) {
        return false;
      }
      return true;
    });

    return filtersToDisplay.map((filterName) => {
      return (
        <div
          key={filterName}
          className={`grid__col grid__col--${FILTER_PARAMS[filterName].width} ${['fc'].includes(client_type) ? 'disabled_element' : ''} `}
        >
          <Filter
            {...FILTER_PARAMS[filterName]}
            name={filterName}
            dateRanges={
              FILTER_PARAMS[filterName].shortRanges
                ? this.props.filters.date_short_ranges
                : this.props.filters.date_ranges
            }
            data={values[filterName]}
            autocompleteUrl={
              autocompleteUrls[FILTER_PARAMS[filterName].autocompleteUrl]
            }
            onChange={this.changeFilter}
            searchPolicyUrl={this.props.searchPolicyUrl}
          />
        </div>
      );
    });
  }

  setFilters = (propsFilters = this.props.filters) => {
    const {
      date_ranges,
      date_short_ranges,
      autocomplete_urls,
      initialValues,
      filtersNames,
      autocompleteUrls,
      onChange,
      api_url,
      time_default,
      ...filters
    } = propsFilters;
    this.defaultFilters = prepareFilters(filters, initialValues, time_default);
    return this.defaultFilters;
  };

  overrideFilters = (propsFilters = this.props.filters, callback) => {
    this.setState({ values: this.setFilters(propsFilters) }, callback);
  };

  isFilterChanged = (name) => {
    const filter = this.state.values[name];
    const type = FILTER_PARAMS[name].type;
    /**
     * if filter has `type` key, then filter is `dateRange` and default type
     * for `dateRange` is `all_period`. So, if `type` isn't `all_period`, then
     * filter was changed
     */
    if (type === 'daterange') {
      return filter.type !== 'all_period';
    }
    if (type === 'text') {
      return !!filter;
    }
    if (type === 'edgecase') {
      return !filter.length || filter[0] !== true || filter[1] !== false;
    }
    /**
     * By default all `checklist` items are checked, and if some of `checklist`
     * options isn't checked, then filter was changed
     */
    if (type === 'checklist') {
      return filter.some(({ checked }) => !checked);
    }
    if (type === 'representative') {
      return !isEmpty(filter);
    }

    if (type === 'offender') {
      return !isEmpty(filter);
    }

    if (type === 'language') {
      return !isEmpty(filter);
    }
    return false;
  };

  serialize = (values = this.values) => {
    return Object.keys(values).reduce((res, key) => {
      if (FILTER_PARAMS[key].type === 'daterange' && !!values[key].field) {
        const { field, ...value } = values[key];
        return { ...res, [`${field}_range`]: value };
      }
      if (FILTER_PARAMS[key].type === 'checklist') {
        if (!values[key]) {
          return { ...res, [key]: { direct_select: true, values: [] } };
        }
        const include_nil = values[key].indexOf('null') > -1;
        if (values[key].length > this.state.values[key].length / 2) {
          return {
            ...res,
            [key]: {
              direct_select: false,
              include_nil,
              values: this.state.values[key]
                .filter(({ checked }) => !checked)
                .map(({ id }) => id),
            },
          };
        }
        return {
          ...res,
          [key]: { direct_select: true, include_nil, values: values[key] },
        };
      }
      if (FILTER_PARAMS[key].type === 'radiolist') {
        return { ...res };
      }
      return { ...res, [key]: values[key] };
    }, {});
  };

  serializeRadio = (values = this.values) => {
    let radio_filter = {};
    Object.entries(this.values).map((el) => {
      if (FILTER_PARAMS[el[0]].type === 'radiolist') {
        el[1].map((innerElement) => {
          if (innerElement.checked) {
            radio_filter[el[0]] = {};
            radio_filter[el[0]].values = [innerElement.id];
          }
        });
      }
    });
    return radio_filter;
  };

  get values() {
    const filtersList = [...this.props.filtersNames];
    const { isAlternateRankIds, isLifeTimeRankIds } = this.state;
    if(this.props.showStatesFilter && isShowRepStatesFilter(this.state.values.rep_countries)){
      filtersList.push('rep_states');
    }
    if(isLifeTimeRankIds || isAlternateRankIds) {
      const index = filtersList.findIndex(item => item === 'rep_ranks')
      filtersList.splice(index+1, 0,'additional_rep_ranks')
    }

    return filtersList.reduce((res, key) => {
      if (FILTER_PARAMS[key].type === 'checklist') {
        if(this.props.filters[key] && this.props.filters[key].length && key === 'rep_states'){
          const filterVals = this.state.values[key]
            .filter(({ checked }) => !!checked)
            .map(({ id }) => id);
          return { ...res, [key]: filterVals };
        } else if (!this.props.filters[key] || !this.props.filters[key].length) {
          return res;
        }
        const filterVals = this.state.values[key]
          .filter(({ checked }) => !!checked)
          .map(({ id }) => id);
        return { ...res, [key]: filterVals };
      }
      return { ...res, [key]: this.state.values[key] };
    }, {});
  }

  get changedValues() {
    return Object.keys(this.values).reduce((res, name) => {
      if (this.isFilterChanged(name)) {
        return { ...res, [name]: this.values[name] };
      }
      return { ...res };
    }, {});
  }

  get changed() {
    return Object.keys(this.state.values).some(this.isFilterChanged);
  }

  render() {
    if (!this.state.isOpen) {
      return null;
    }

    return (
      <div className="grid">
        {!!this.props.showClearBtn && (
          <Button size="small" status="black" className={`${['fc'].includes(getClientType()) ? 'disabled_element' : ''}`} onClick={this.clear}>
            Clear All
          </Button>
        )}
        <div className="grid__row">{this.filtersDom}</div>
      </div>
    );
  }
}
