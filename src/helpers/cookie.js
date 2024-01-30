export function getClientType(name = 'client_type') {
    var pair = document.cookie.split('; ').find(x => x.startsWith(name+'='));
    if (pair)
       return pair.split('=')[1]
  }