export default class FieldCheckAPI {
  static defaultParams = {
    method: "GET",
    cache: "default",
  };
  static sendRequest(url, fc_api_key, { searchParams, ...params }) {
    const request = new Promise((resolve, reject) => {
      fetch(url, {
        ...FieldCheckAPI.defaultParams,
        ...params,
        headers: {
          Accept: "application/json",
          ["x-api-key"]: fc_api_key
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          resolve({});
        })
        .then((res) => {
          resolve(res);
        })
        .catch(function (err) {
          console.log(
            "There has been a problem with your fetch operation: ",
            err
          );
        });
    });
    return request;
  }

  static get(url, fc_api_key, additionalParams = {}) {
    const { body, ...params } = additionalParams;
    return FieldCheckAPI.sendRequest(url, fc_api_key, {
      ...params,
      searchParams: body,
      method: "GET",
    });
  }

  static post(url, fc_api_key, params = {}) {
    return FieldCheckAPI.sendRequest(url, fc_api_key, {
      ...params,
      body:
        params.body instanceof FormData
          ? params.body
          : JSON.stringify(params.body),
      method: "POST",
    });
  }
}
