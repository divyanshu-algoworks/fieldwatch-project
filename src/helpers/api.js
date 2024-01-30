import getToken from './getToken';
import { toQueryString } from './url';

function showRequestNotification(status, res = {}) {
  const body = res.body && JSON.parse(res.body);
  if (status === 200 || status === 204) {
    return;
  }
  if (status === 403) {
    // FW.flash({ type: 'info', text: 'Forbidden action' });
  }
  if (status === 401) {
    // FW.flash({ type: 'info', text: 'Your session has been expired' });
    window.location.reload(false)
  } 
  // else if (status === 422) {
  //   FW.flash({
  //     type: 'warning',
  //     text: body && body.client && body.client.fc_client_id_edit ?  
  //      'Selected FC client is already associated with another FW client' 
  //     :
  //      'Sorry, but request has not passed some security protection, please reload the page and try again.'
  //   });
  // } else {
  //   FW.flash({
  //     type: 'error',
  //     text: 'Something went wrong. Please contact system administrator',
  //   });
  // }
}

export default class API {
  static defaultParams = {
    headers: {
      Accept: 'application/json',
      ['X-CSRF-Token']: getToken().authenticity_token,
    },
    method: 'GET',
    cache: 'default',
  };

  static getUrl(url, searchParams) {
    const emailToken = JSON.parse(localStorage.getItem('userInfoState')).userToken;
    let resUrl = `${url}?email_token=${emailToken}`;
    if (!!searchParams) {
      const paramsStr = toQueryString(searchParams);
      if (!!paramsStr.length) {
        resUrl = `${resUrl}&${paramsStr}`;
      }
    }
    return `https://devperform.fieldwatch.org${resUrl}`
  }

  static sendRequest(url, { searchParams, ...params }) {
    let headers = {
      ...API.defaultParams.headers,
      ...params.headers,
    };
    let controller = new window.AbortController();
    let signal = controller.signal;
    if (!!params.body && !(params.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const request = new Promise((resolve, reject) => {
      fetch(API.getUrl(url, searchParams), {
        ...API.defaultParams,
        ...params,
        signal,
        headers,
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          showRequestNotification(res.status, params);
          resolve({});
        })
        .then((res) => {
          if (res.redirect) {
            window.location.href = res.redirect;
          }
          if (res.redirect_url) {
            localStorage.setItem('redirect_url', res.redirect_url)
            window.location.reload(false);
          }
          if (!!res.flash_type && !!res.flash_message) {
            // FW.flash({ type: res.flash_type, text: res.flash_message });
          }
          resolve(res);
        })
        .catch(function (err) {
          console.log(
            'There has been a problem with your fetch operation: ' , err
          );
        });
    });
    request.abort = controller.abort.bind(controller);
    return request;
  }

  static get(url, additionalParams = {}) {
    const { body, ...params } = additionalParams;
    return API.sendRequest(url, {
      ...params,
      searchParams: body,
      method: 'GET',
    });
  }

  static post(url, params = {}) {
    return API.sendRequest(url, {
      ...params,
      body:
        params.body instanceof FormData
          ? params.body
          : JSON.stringify(params.body),
      method: 'POST',
    });
  }

  static put(url, params = {}) {
    return API.sendRequest(url, {
      ...params,
      body:
        params.body instanceof FormData
          ? params.body
          : JSON.stringify(params.body),
      method: 'PUT',
    });
  }

  static patch(url, params = {}) {
    return API.sendRequest(url, {
      ...params,
      body:
        params.body instanceof FormData
          ? params.body
          : JSON.stringify(params.body),
      method: 'PATCH',
    });
  }

  static delete(url, params) {
    return API.sendRequest(url, { ...params, method: 'DELETE' });
  }
}
