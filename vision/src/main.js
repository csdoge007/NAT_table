import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/font/iconfont.css'
import './assets/css/global.less'
import SocketService from '@/utils/socket_service'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);
//对服务端进行websocket连接
SocketService.Instance.connect()
//其他的组件 this.$socket
Vue.prototype.$socket = SocketService.Instance
//请求基准路径的配置
axios.defaults.baseURL = 'localhost:8808/api/'
// 将axios挂载到Vue的原型对象上
// 在别的组件中 this.$http
Vue.prototype.$http = axios
//将全局的echarts对象挂载到Vue的原型对象上
//别的组件中 this.$echarts就可调用
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
