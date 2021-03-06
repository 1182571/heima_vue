import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import('@/components/Login')
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    redirect: '/welecome',
    component: () => import('@/components/Home'),
    children: [
      {
        path: '/welecome',
        component: () => import('@/components/Welecome')
      },
      {
        path: '/users',
        component: () => import('@/components/user/')
      },
      {
        path: '/rights',
        component: () => import('@/components/power/Rights')
      },
      {
        path: '/roles',
        component: () => import('@/components/power/Roles')
      },
      {
        path: '/categories',
        component: () => import('@/components/goods/categories')
      },
      {
        path: '/params',
        component: () => import('@/components/goods/params.vue')
      },
      {
        path: '/goods',
        component: () => import('@/components/goods/list.vue')
      },
      {
        path: '/goods/add',
        component: () => import('@/components/goods/add.vue')
      },
      {
        path: '/orders',
        component: () => import('@/components/Order/orders')
      },
      {
        path: '/reports',
        component: () => import('@/components/reports/reports')
      }

    ]
  }

]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
