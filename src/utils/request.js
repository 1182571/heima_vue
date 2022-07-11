import axios from 'axios'
const request = axios.create({
  baseURL: 'http://49.232.79.213:8888/api/private/v1/'

})
request.interceptors.request.use((config) => {
  // 最后必须return
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
export default request
