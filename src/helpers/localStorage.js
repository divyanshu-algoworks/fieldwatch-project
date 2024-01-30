export function addFilterView(clientId, view) {
  const views = {
    ...JSON.parse(localStorage.getItem('incident_filters_view')),
    [clientId]: view,
  };
  localStorage.setItem('incident_filters_view', JSON.stringify(views));
}
export function loadFilterView(clientId) {
  const filterViews = JSON.parse(localStorage.getItem('incident_filters_view'));
  if (!filterViews || !filterViews[clientId]) {
    return { id: 'default' };
  }
  return filterViews[clientId];
}

export function deleteFilterView(clientId) {
  const views = JSON.parse(localStorage.getItem('incident_filters_view'));
  if (!!views && !!views[clientId]) {
    delete views[clientId];
  }
  localStorage.setItem('incident_filters_view', JSON.stringify(views));
}

export function replaceOldFiltersInLocalStorage() {
  const incidentFiltersView = JSON.parse(localStorage.incidentFiltersView);

}
