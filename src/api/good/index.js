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
// 删除分类categories/:id
export const reqDeleteCate = (id) => request({
  url: `categories/${id}`,
  method: 'delete'
})
// 商品分类数据列表 categories
export const reqGetListCate = () => request({
  url: 'categories',
  method: 'get'
})
// 参数列表 categories/:id/attributes
export const reqGetList = (id, sel) => request({
  url: `categories/${id}/attributes`,
  method: 'get',
  params: { sel }
})
// 添加动态参数或者静态属性categories/:id/attributes
export const reqAddManyValue = (id, attrname, attrsel) => request({
  url: `categories/${id}/attributes`,
  method: 'post',
  data: { attr_name: attrname, attr_sel: attrsel }
})
// 根据 ID 查询参数 categories/:id/attributes/:attrId
export const reqGetManyOrstatValue = (id, attrId, attrsel) => request({
  url: `categories/${id}/attributes/${attrId}`,
  method: 'get',
  data: { attr_sel: attrsel }
})
// 编辑提交 categories/:id/attributes/:attrId
export const reqeditManyOrstatValue = (id, attrId, attrname, attrsel) => request({
  url: `categories/${id}/attributes/${attrId}`,
  method: 'put',
  data: { attr_sel: attrsel, attr_name: attrname }
})
// 删除参数categories/:id/attributes/:attrid
export const reqDeleteManyOrstatValue = (id, attrId) => request({
  url: `categories/${id}/attributes/${attrId}`,
  method: 'delete'
})
// 编辑提交参数 categories/:id/attributes/:attrId
export const reqPushManyOrstatValue = (id, attrId, attrname, attrsel, attrvals) => request({
  url: `categories/${id}/attributes/${attrId}`,
  method: 'put',
  data: { attr_name: attrname, attr_sel: attrsel, attr_vals: attrvals }
})

// 商品列表数据 goods
export const reqGetGoodsValue = ({ query, pagenum, pagesize }) => request({
  url: 'goods',
  method: 'get',
  params: { query, pagenum, pagesize }
})
// 删除商品 goods/:id
export const reqDeleteGoods = (id) => request({
  url: `goods/${id}`,
  method: 'delete'
})
// 商品分类数据列表  categories
export const reqGetGateList = () => request({
  url: 'categories',
  method: 'get'
})
// 参数列表 categories/:id/attributes
export const reqGetcategories = (id, { sel }) => request({
  url: `categories/${id}/attributes`,
  method: 'get',
  params: { sel }
})
// 添加商品
export const reqAddgoods = (goods) => request({
  url: 'goods',
  method: 'post',
  data: goods
})
// 订单数据列表orders
export const reqGetOrder = (params) => request({
  url: 'orders',
  method: 'get',
  params
})
// 查看物流信息/kuaidi/:id 供测试的物流单号：1106975712662
export const reqGetkuaidi = (id) => request({
  url: `/kuaidi/${id}`,
  method: 'get'
})
// 基于时间统计的折线图 reports/type/1
export const reqreports = () => request({
  url: 'reports/type/1',
  method: 'get'
})
