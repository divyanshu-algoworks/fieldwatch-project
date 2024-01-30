import { FILTER_PARAMS } from '../constants/FilterParams';
export default function serializeFiltersViewSettings(viewSettings) {
  return JSON.stringify(Object.keys(viewSettings).reduce((res, key) => {
    if (FILTER_PARAMS[key].type === 'checklist') {
      res[key] = viewSettings[key].reduce((res, id) => {
        res[id] = true;
        return res;
      }, {})
    }
    else if (FILTER_PARAMS[key].type === 'edgecase') {
      res[key] = {
        'true': viewSettings[key][0] || false,
        'false': (viewSettings[key][0] === false) || (viewSettings[key][1] === false) || false,
      };
    }
    return res;
  }, {}));
}
