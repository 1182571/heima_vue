import request from '@/utils/request'
// 商品分类数据列表categories
export const reqGetCateGoriesList = ({ type, pagenum, pagesize }) => request({
  url: 'categories',
  method: 'get',
  params: { type, pagenum, pagesize }
})
// 获取父级分类的数据categories
export const reqGetParentCateList = () => request({
  url: 'categories',
  method: 'get',
  params: { type: 3 }
})
// 添加分类
export const reqAddCate = (catpid, catname, catlevel) => request({
  url: 'categories',
  method: 'post',
  data: { cat_pid: catpid, cat_name: catname, cat_level: catlevel }
})
// 查找分类categories/:id
export const reqGetCate = (id) => request({
  url: `categories/${id}`,
  method: 'get'
})
// 编辑提交分类categories/:id
export const reqEditCate = (id, catname) => request({
  url: `categories/${id}`,
  method: 'put',
  data: { cat_name: catname }
})
