import { removeItem } from "./array";

export function saveFiltersViewToLocalStorage(view, clientId, viewKey) {
  const existViews = JSON.parse(localStorage.getItem(viewKey));
  localStorage.setItem(viewKey, JSON.stringify({ ...existViews, [clientId]: view }));
}

export function loadFiltersViewFromLocalStorage(clientId, viewKey) {
  try {
    return { selectedView: JSON.parse(localStorage.getItem(viewKey))[clientId] };
  } catch (error) {
    return { error };
  }
}

export function deleteFiltersViewFromLocalStorage(clientId, viewKey) {
  const views = JSON.parse(localStorage.getItem(viewKey));
  delete views[clientId];
  localStorage.setItem(viewKey, views);
}

export function isShowRepStatesFilter(rep_countries = []){
  const checkedCountries = rep_countries.filter((country) => country.checked);
  // United states, brazil, colombia, mexico, canada
  const countryIdsWithStates = [236, 32, 49, 144, 40];
  
  return checkedCountries.length === 1 && countryIdsWithStates.includes(checkedCountries[0].id);
}

export function getRepStatesFilterValues(rep_countries, rep_states = [], isFiltered){
  let selectedRepCountries = rep_countries;
  if(!isFiltered){
    selectedRepCountries = rep_countries.filter(c => c.checked).map(({id}) => id);
  }
  const countryIdsWithStates = [236, 32, 49, 144, 40];
  
  if(selectedRepCountries.length === 1){
    const selectedCountryId = selectedRepCountries[0];
    
    if(countryIdsWithStates.includes(selectedCountryId)){
      return rep_states.filter(state => state.country_id === selectedCountryId).map(state => ({
        ...state,
        checked: true
      }))
    }
  }

  return [];
}