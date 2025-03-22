import axios from 'axios'

// 创建 Axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 3000,
})

// 请求拦截器 - 自动添加 token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = token
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
  response => response.data, // 直接返回 data
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 封装请求方法
const request = {
  get: (url, params) => api.get(url, { params }),
  post: (url, data) => api.post(url, data),
  put: (url, data) => api.put(url, data),
  delete: (url) => api.delete(url),
}

// API 分组
export default {

  auth: {
    login: (data) => request.post('/login', data),
  },

  menu: {
    getAll: () => request.get('/menu'),
    menuInfo: () => request.get('/menuInfo'),
    create: (data) => request.post('/menu', data),
    update: (id, data) => request.put(`/menu/${id}`, data),
    delete: (id) => request.delete(`/menu/${id}`),
  },


  user: {
    getAll: () => request.get('/user'),
    create: (data) => request.post('/user', data),
    update: (id, data) => request.put(`/user/${id}`, data),
    delete: (id) => request.delete(`/user/${id}`),
    userInfo: () => request.get('/userInfo'),
  },

  news: {
    getAll: (params) => request.get('/news',  params ),
    create: (data) => request.post('/news', data),
    update: (id, data) => request.put(`/news/${id}`, data),
    delete: (id) => request.delete(`/news/${id}`),
  },

  team: {
    getAll: () => request.get('/team'),
    create: (data) => request.post('/team', data),
    update: (id, data) => request.put(`/team/${id}`, data),
    delete: (id) => request.delete(`/team/${id}`),
  },

  field: {
    getAll: () => request.get('/field'),
    create: (data) => request.post('/field', data),
    update: (id, data) => request.put(`/field/${id}`, data),
    delete: (id) => request.delete(`/field/${id}`),
  },


  
  product: {
    getAll: () => request.get('/product'),
    create: (data) => request.post('/product', data),
    update: (id, data) => request.put(`/product/${id}`, data),
    delete: (id) => request.delete(`/v/${id}`),
  },

}