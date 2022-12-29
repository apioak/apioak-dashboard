import axios from "./axios.js";
import store from "../store/index";

export function request(url, params, method = "get") {
  /*let baseUrl =
      process.env.NODE_ENV === "local" ? process.env.VUE_APP_ROOT : "/api/";*/
  url = "api/" + url;
  //添加header头
  let header = {
    "auth-token": store.state.token,
  };
  switch (method) {
    case "delete":
      return del(url, params, header);
    case "post":
      return post(url, params, header);
    case "put":
      return put(url, params, header);
    default:
      return get(url, params, header);
  }
}

export function post(url, data = {}, headers = {}) {
  headers["Content-Type"] = "application/json";
  data = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    axios
      .post(url, data, {
        headers: headers,
      })
      .then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        }
      );
  });
}

export function put(url, data = {}, headers = {}) {
  headers["Content-Type"] = "application/json";
  data = JSON.stringify(data);
  return new Promise((resolve, reject) => {
    axios
      .put(url, data, {
        headers: headers,
      })
      .then(
        (response) => {
          resolve(response.data);
        },
        (err) => {
          reject(err);
        }
      );
  });
}

export function get(url, params = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
        headers: headers,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function del(url, params = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    axios
      .delete(url, {
        params: params,
        headers: headers,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
