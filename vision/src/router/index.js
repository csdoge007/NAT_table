import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/newposition',
    component: () => import('../views/newposition.vue')
  },
  {
    path:'/qinhuai',
    component: () => import('../components/qinhuai.vue')
  },
  {
    path:'/gulou',
    component: () => import('../components/gulou.vue')
  },
  {
    path:'/jianye',
    component: () => import('../components/jianye.vue')
  },
  {
    path:'/pukou',
    component: () => import('../components/pukou.vue')
  },
  {
    path:'/qixia',
    component: () => import('../components/qixia.vue')
  },
  {
    path:'/jiangning',
    component: () => import('../components/jiangning.vue')
  },
  {
    path:'/liuhe',
    component: () => import('../components/liuhe.vue')
  },
  {
    path:'/yuhuatai',
    component: () => import('../components/yuhuatai.vue')
  },
  {
    path:'/lishui',
    component: () => import('../components/lishui.vue')
  },
  {
    path:'/gaochun',
    component: () => import('../components/gaochun.vue')
  },
  {
    path:'/xuanwu',
    component: () => import('../components/xuanwu.vue')
  },
  {
    path: '/countpage',
    component: () => import('../views/countpage.vue')
  },
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    component: () => import('@/views/ScreenPage')
  },
  {
    path: '/sellerpage',
    component: () => import('@/views/SellerPage')
  },
  {
    path: '/stock',
    name: 'stock',
    component: () => import('@/views/StockPage')
  },
  {
    path: '/map',
    component: () => import('@/views/MapPage')
  },
  {
    path: '/relL1',
    name: 'relL1',
    component: () => import('@/views/relL1')
  },
  {
    path: '/newpublicL/:id',
    name: 'newpublicL',
    component: () => import('@/views/newpublicL.vue')
  },
  {
    path: '/relL/:id',
    name: 'relL',
    component: () => import('@/views/relL.vue')
  }
]

//创建路由实例
const router = new VueRouter({
  routes
})
const timeover = 1000 * 60 * 60 * 5

// 路由守卫
router.beforeEach((to,from,next) => {
  let token = localStorage.getItem("token")
  let starttime = localStorage.getItem("tokenstarttime")
  let datime = new Date().getTime()
  let pathh = to.path
  let pathFrom = from.path
  if((pathh.indexOf('rel') == -1)){
    next()
  }else if(pathh.indexOf('rel') !== -1 && token && datime - starttime <= timeover){
    // localStorage.removeItem('token') // 清除token缓存
    next()
  }else{
    localStorage.removeItem('token')
    localStorage.removeItem('tokenstarttime')
    next(pathFrom)
  }
})

export default router
