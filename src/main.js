import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/glbal.css'
import { Form, Dialog, FormItem, Input, Button, Message, Container, Header, Aside, Main, Menu, MenuItemGroup, Submenu, MenuItem, Breadcrumb, BreadcrumbItem, Card, Row, Col, TableColumn, Table, Switch, Tooltip, Pagination, MessageBox } from 'element-ui'
import API from '@/api/index'
import '@/assets/fonts/iconfont.css'
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
Vue.prototype.$confirm = MessageBox.confirm

Vue.prototype.$message = Message
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
