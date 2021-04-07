import config from '../config'

const baseURL = config.baseURL;
const axios = require('axios').create({
  baseURL,            //api请求的baseURL
  timeout: 0,
  withCredentials: true, // 允许跨域 cookie
  headers: {'X-Requested-With': 'XMLHttpRequest'},
  maxContentLength: 2000,
  transformResponse: [function (data) {
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = {};
    }
    return data;
  }]
});

// get
export const _get = (req) => {
  return axios.get(req.url, {params: req.data})
};

// post
export const _post = (req) => {
  return axios({method: 'post', url: `/${req.url}`, data: req.data})
};

//put
export const _put = (req) => {
  return axios({method: 'put', url: `/${req.url}`, data: req.data})
};

//delete
export const _delete = (req) => {
  return axios({method: 'delete', url: `/${req.url}`, data: req.data})
};

// export const _getNoWithCredentials = (url) => {
//     return axios({method: 'get', url: `/${url}`, withCredentials:false,proxyHeaders: false, credentials: false})
// };
