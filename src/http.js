import axios from 'axios';

const VUE_APP_API_URL = process.env.VUE_APP_API_URL;

const http = axios.create({
  baseURL: VUE_APP_API_URL
})

http.interceptors.request.use(function (config) {
  let token = localStorage.getItem("key");
  if (token) {
    config.headers.Authorization = "token " + token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default class APIService {
  async get(url, headers = {}, responseType = 'json') {
    try {
      return await http.get(url, {
        headers: {
          ...headers,
        },
        responseType: responseType,
        data: {},
      });
    } 
    catch (e) {
      if (e.response.status == 401) {
        window.location.href = "/";
        throw e.response;
      }
      throw e.response;
    }
  }

  async post(url, content, headers = {}, responseType = 'json') {
    try {
      return await http.post(url, content, {
        headers: {
          ...headers
        },
        responseType: responseType
      });
    }
    catch (e) {
      if (e.response.status == 401) {
        throw e.response;
      }
      throw e.response;
    }
  }

  async put(url, content, headers = {}) {
    try {
      return await http.put(url, content, {
        headers: {
          ...headers
        }
      });
    }
    catch (e) {
      if (e.response.status == 401) {
        throw e.response;
      }
      throw e.response;
    }
  }

  async patch(url, content, headers = {}) {
    try {
      return await http.patch(url, content, {
        headers: {
          ...headers
        }
      })
    }
    catch (e) {
      if (e.response.status == 401) {
        throw e.response;
      }
      throw e.response;
    }
  }

  async delete(url, content = {}, headers = {}) {
    try {
      return http.delete(url, {
        headers: {
          ...headers
        },
        data: content
      })
    } 
    catch (e) {
      if (e.response.status == 401) {
        throw e.response;
      }
      throw e.response;
    }
  }

  async download(requestMethod, url, responseType, headers, payload) {
    try {
      let response = await http({
        method: requestMethod,
        url: url,
        headers: headers,
        responseType: responseType,
        data: payload
      })
      let blob = new Blob([response.data], { type: 'application/pdf' });
      let blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl);
    }
    catch (e) {
      if (e.response.status == 401) {
        throw e.response;
      }
      throw e.response;
    }
  }
}
