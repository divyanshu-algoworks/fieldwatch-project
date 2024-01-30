export default function snakeToCapitalize(str) {
  if (!str.length) {
    return '';
  }

  return str
    .split('_')
    .map(word => `${word[0].toUpperCase()}${word.substr(1)}`)
    .join(' ');
}
