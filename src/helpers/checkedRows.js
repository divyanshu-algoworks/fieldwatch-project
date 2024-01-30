export function isRowChecked(item, selectedItems) {
  if (!selectedItems) {
    return false;
  }
  return selectedItems.findIndex(({ id }) => item.id === id) > -1;
}

export function isAllRowsChecked(data, selectedItems) {
  if (!data) {
    return false;
  }
  return data.every(item => isRowChecked(item, selectedItems));
}
