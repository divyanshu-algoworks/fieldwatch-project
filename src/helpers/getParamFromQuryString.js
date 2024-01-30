/**
 *
 * @param {string} name query param name
 * @param {string} url url address
 */
function getParamFromQuryString(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) {
    return null;
  }

  return decodeURIComponent(results[2].replace(/\+/g, ''));
}

export default getParamFromQuryString;
