import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/glbal.css'
import { Form, FormItem, Input, Button, Message } from 'element-ui'
import API from '@/api/index'
Vue.prototype.$API = API
Vue.config.productionTip = false
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.prototype.$message = Message
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
