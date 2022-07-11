import request from '@/utils/request'
// 登录接口
export const reqUserLogin = ({ username, password }) => request({
  url: '/login',
  method: 'post',
  data: {
    username,
    password
  }
})
// 左侧菜单 menus
export const getMenuList = () => request({
  url: 'menus'
})
// 用户数据列表 users
export const reqGetUserList = (pageObj) => request({
  url: 'users',
  params: pageObj
})
// 修改用户状态users/:uId/state/:type
export const reqUserStateChanged = (uid, type) => request({
  url: `users/${uid}/state/${type}`,
  method: 'put'
})
// 添加用户接口
export const reqAddUser = (userObj) => request({
  url: 'users',
  method: 'post',
  data: userObj
})
// 根据 ID 查询用户信息users/:id
export const reqGetUser = (id) => request({
  url: `users/${id}`,
  method: 'get'
})
// 修改用户信息users/:id
export const reqEditUserInfo = ({ id, email, mobile }) => request({
  url: `users/${id}`,
  method: 'put',
  data: { email, mobile }
})
// 删除用户users/:id
export const reqDeleteUser = (id) => request({
  url: `users/${id}`,
  method: 'delete'
})
