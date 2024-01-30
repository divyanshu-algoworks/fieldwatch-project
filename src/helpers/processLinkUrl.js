export default function processLinkUrl(url) {
  if (url.indexOf('//') === -1) {
    return '//' + url;
  }
  return url;
}
