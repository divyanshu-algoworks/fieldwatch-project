import { getObjectValue, hostEndsWith } from './object';

function getText(text, isHtml = false) {
  if (isHtml) {
    let node = document.createElement('div');
    node.innerHTML = text;
    return node.innerText;
  }
  return text || '';
}

export function checkRequired(key, msg = 'can\'t be blank') {
  return function ({ item }) {
    const val = getObjectValue(item, key);
    if (!val || val.length === 0) {
      return [msg];
    }
    return null;
  }
}

export function validateEmail(key, msg='Invalid email format') {
  return function ({ item }) {
    const val = getObjectValue(item, key);
    if (!val || val.length == 0) return null;

    let emailArray = [];
    if (val.includes(";")) 
     emailArray = val.split(";");
    else
     emailArray = val.split(",");
    let output = null;
    for (let j = 0; j < emailArray.length; j++) {
      let email = emailArray[j].trim();
      let emailDomain = email.split(".");
      if (!email || email.length == 0) {
      } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        if (!hostEndsWith(emailDomain[emailDomain.length -1])) {
          output = [msg];
        }
      }
    }
    return output;
  };
}

export function checkLength(key, len, isHtml = false, msg = `is too short (minimum is ${len} characters)`) {
  return function ({ item }) {

    const text = getText(item[key], isHtml);
    if (key === 'password' && !item[key]) {
     return null
    }
    if (text.length < len) {
      return msg;
    }
    return null;
  }
}

export function checkMinVal(key, minVal = 0, msg = `should be bigger than ${minVal}`) {
  return function ({ item }) {
    if (item[key] === undefined || item[key] === '') {
      return 'can\'t be blank';
    }
    if (item[key] <= minVal) {
      return msg;
    }
    return null;
  }
}

