import Vue from 'vue'
import Router from 'vue-router'
import store from "./store";

Vue.use(Router)

const routes = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/pages/Login'),
  },
  {
    path: '/',
    component: () => import('@/views/Index'),
    children: [
      {
        path: '',
        component: () => import('@/views/pages/Dashboard'),
        redirect: 'parsers',
      },
      {
        path: 'user',
        component: () => import('@/views/pages/UserProfile'),
      },
      {
        path: 'categories',
        component: () => import('@/views/pages/Categories'),
      },
      {
        path: 'purchases',
        component: () => import('@/views/pages/Purchase'),
      },
      {
        path: 'manufacturers',
        component: () => import('@/views/pages/Manufacturers'),
      },
      {
        path: 'store',
        component: () => import('@/views/pages/Store'),
      },
      {
        path: 'purchased-products',
        component: () => import('@/views/pages/PurchasedProducts'),
      },
      {
        path: 'vendors',
        component: () => import('@/views/pages/Vendors'),
      },
      {
        path: 'parsers',
        // component: () => import('@/views/pages/Parser2'),
        component: () => import('@/views/pages/Parser'),
      },
      {
        path: 'parsers-old',
        // component: () => import('@/views/pages/Parser2'),
        component: () => import('@/views/pages/Parser_old'),
      },
      {
        path: 'clients',
        component: () => import('@/views/pages/Clients'),
      },
      {
        path: 'offers',
        component: () => import('@/views/pages/Offers'),
      },
      {
        path: 'sales',
        component: () => import('@/views/pages/Sales'),
      },
      {
        path: 'filters',
        component: () => import('@/views/pages/Filters'),
      },
      {
        path: 'assemblies',
        component: () => import('@/views/pages/Assemblies'),
      },
      {
        path: 'system-settings',
        component: () => import('@/views/pages/SystemSettings'),
      },
    ],
  },
  {
    name: 'Error',
    path: '*',
    component: () => import('@/views/pages/Error'),
  },
]

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

function isAuthenticated(to, from, next) {
  if (store.getters.isLogged) {
    next()
  } else {
    next('/login')
  }
}

export default router
