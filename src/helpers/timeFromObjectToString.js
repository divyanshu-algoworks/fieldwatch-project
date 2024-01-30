/**
 * Transform time object to string
 * @param {object} param0 object with 'days', 'hours' and 'minutes' keys
 */
function timeFromObjectToString({ days, hours, minutes }) {
  const d = days ? `${days}d ` : '';
  const h = hours ? `${hours}h ` : '';
  const m = minutes ? `${minutes}m ` : '';
  return `${d}${h}${m}` || '-';
}

export default timeFromObjectToString;
