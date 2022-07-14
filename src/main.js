import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/glbal.css'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'

import { Form, Dialog, FormItem, Input, Button, Message, Container, Header, Aside, Main, Menu, MenuItemGroup, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, TableColumn, Table, Switch, Tooltip, Pagination, MessageBox, Tag, Popconfirm, Cascader, Alert, Tabs, TabPane, Steps, Step, Checkbox, CheckboxGroup, Upload, RadioGroup, Radio, Timeline, TimelineItem } from 'element-ui'
import API from '@/api/index'
import '@/assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid' // for bubble theme

Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
Vue.prototype.$API = API
Vue.config.productionTip = false
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Popconfirm)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d}-${d}-${hh}-${mm}-${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
