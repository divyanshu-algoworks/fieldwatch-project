export function searchTimezone(option, search, {getOptionLabel}) {
  const optionName = getOptionLabel(option);
  const timeZoneName = optionName.split(') ')[1];
  return timeZoneName.toLowerCase().startsWith(search.toLowerCase());
}