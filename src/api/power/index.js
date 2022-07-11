import request from '@/utils/request'
// 获取所有权限列表 rights/:type
export const reqGetRightsList = (type) => request({
  url: `rights/${type}`,
  method: 'get'
})
// 获取角色列表 roles
export const reqGetRoles = () => request({
  url: 'roles',
  method: 'get'
})
// 添加角色 roles
export const reqAddRoles = ({ roleName, roleDesc }) => request({
  url: 'roles',
  method: 'post',
  data: { roleName, roleDesc }

})
// 查询角色 roles/:id
export const reqGetRoules = (id) => request({
  url: `roles/${id}`,
  method: 'get',
  data: id
})
// 编辑提交角色 roles/:id
export const reqEditRoules = ({ roleId, roleName, roleDesc }) => request({
  url: `roles/${roleId}`,
  method: 'put',
  data: { id: roleId, roleName, roleDesc }
})
// 删除角色
export const reqDeleteRoules = (id) => request({
  url: `roles/${id}`,
  method: 'delete'
})
