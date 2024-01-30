import moment from 'moment';
import { FILTER_PARAMS } from '../constants/FilterParams';

function isChecked(filter, initialValues) {
  if (!initialValues) {
    return true;
  }
  return (
    initialValues.indexOf('' + filter.id) > -1 ||
    initialValues.indexOf(filter.id) > -1
  );
}

/**
 * Transform filters object from server (make all filters checked)
 * @param {object} filters object with filters from server side
 */
export default function prepareFilters(
  { date_ranges, date_short_ranges, ...filters },
  initialValues,
  time_default
) {
  const resFilters = Object.keys(filters).reduce((res, key) => {
    const filterConfig = FILTER_PARAMS[key];
    if (!filterConfig) {
      console.error('Undefined filter', key);
      return res;
    }

    if (filterConfig.type === 'checklist') {
      /** All filters must be checked by default */
      res[key] = filters[key].map((filter) => {
        const checked = isChecked(
          filter,
          !!initialValues && initialValues[key]
        );
        return { ...filter, checked };
      });
    } else if (filterConfig.type === 'edgecase') {
      res[key] =
        !!initialValues && !!initialValues[key]
          ? initialValues[key]
          : [true, false];
    } else if (
      filterConfig.type === 'daterange' &&
      (!!time_default || !!filterConfig.timeDefault)
    ) {
      res[key] = (!!initialValues && initialValues[key]) || {
        type: 'all_period',
        from: moment().format('MM/DD/YYYY'),
        till: moment().format('MM/DD/YYYY'),
      };
      if (!!filterConfig.types) {
        res[key].field =
          (!!initialValues &&
            !!initialValues[key] &&
            initialValues[key].field) ||
          'reported_date';
      }
    } else if (filterConfig.type === 'daterange') {
      res[key] = (!!initialValues && initialValues[key]) || {
        type: 'beginning_of_month',
        from: moment().format('MM/DD/YYYY'),
        till: moment().format('MM/DD/YYYY'),
      };
      if (!!filterConfig.types) {
        res[key].field =
          (!!initialValues &&
            !!initialValues[key] &&
            initialValues[key].field) ||
          'reported_date';
      }
    } else {
      res[key] =
        !!initialValues && initialValues[key] !== undefined
          ? initialValues[key]
          : filters[key] || '';
    }
    return res;
  }, {});
  return resFilters;
}
