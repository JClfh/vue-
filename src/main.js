import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
//导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import axios from 'axios';

axios.defaults.baseURL='http://timemeetyou.com:8889/api/private/v1/'
// axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'

axios.interceptors.request.use(config => {
  // NProgress.start()
  console.log(config)
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})


Vue.prototype.$axios=axios;

Vue.config.productionTip = false
Vue.use(ElementUI);
// 组件全局注册 表格树
Vue.component('tree-table', TreeTable)
// 全局注册富文本编辑器
Vue.use(VueQuillEditor)
Vue.filter('dateFormat',function (originVal) {
   const dt = new Date(originVal)
   const y=dt.getFullYear()
   const m=(dt.getMonth()+1+'').padStart(2,'0')
   const d = (dt.getDate() + '').padStart(2, '0')

   const hh = (dt.getHours() + '').padStart(2, '0')
   const mm = (dt.getMinutes() + '').padStart(2, '0')
   const ss = (dt.getSeconds() + '').padStart(2, '0')
   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
