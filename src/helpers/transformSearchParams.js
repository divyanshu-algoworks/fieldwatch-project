function transformSearchParam(key, value) {
  // If param is array
  if(value === undefined) {
    return
  }
  if(typeof value !== 'string' && value.length !== undefined) {
    return value.map(function(v) { return transformSearchParam(`${key}[]`, v)}).join('&');
  }
  // If param is object
  if(typeof value === 'object') {
    return Object.keys(value).map(function(k) {
      return transformSearchParam(`${key}[${k}]`, value[k]);
    })
    .filter(item => !!item)
    .join('&');
  }
  return `${key}=${value}`;
}
function transformSearchParams(params) {
  return Object.keys(params).map(function(key) {
    return transformSearchParam(key, params[key]);
  })
  .filter(item => !!item)
  .join('&')
  .replace('#', '%23');
}

export default transformSearchParams;