function getMetaTagValue(name) {
  if(!document.head.querySelector(`meta[name="${name}"]`)){
return null;
  }
  return document.head.querySelector(`meta[name="${name}"]`).getAttribute('content');
}
function getToken() {
  const key = getMetaTagValue('csrf-param');
  const value = getMetaTagValue('csrf-token');
  return {[key]: value};
}

export default getToken;
