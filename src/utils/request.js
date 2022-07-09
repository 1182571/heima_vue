import axios from 'axios'
const request = axios.create({
  baseURL: 'http://49.232.79.213:8888/api/private/v1/'

})
export default request
