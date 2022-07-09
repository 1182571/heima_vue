import request from '@/utils/request'
export const reqUserLogin = ({ username, password }) => request({
  url: '/login',
  method: 'post',
  data: {
    username,
    password
  }
})
