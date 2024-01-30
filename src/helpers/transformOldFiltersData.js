function transformOldFiltersData({ filter_ranges, filter_short_ranges, ...filterData }) {
  return {
    ...filterData,
    data_ranges: filter_ranges,
    data_short_ranges: filter_short_ranges,
  };
}

export default transformOldFiltersData;
