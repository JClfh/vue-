import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
//404
import  NotFound from '../views/404.vue'
import  Welcome from '../components/Welcome.vue'
import  Users from '../components/user/Users.vue'
import  Rights from '../components/power/Rights.vue'
import  Roles from '../components/power/Roles.vue'
import  Cate from '../components/goods/Cate.vue'
import  GoodsList from '../components/goods/GoodsList.vue'
import  Add from '../components/goods/Add.vue'
import  Params from '../components/goods/Params.vue'
import  Orders from '../components/orders/Orders.vue'
import  Reports from '../components/reports/Reports.vue'
Vue.use(VueRouter)

const routes = [
          {path:'/',redirect:'/login'},
          {path:'/login',component:Login},
         
          {
            path: '/home',
            component: Home,
            redirect: '/welcome',
           children: [
             {path :'/welcome',component: Welcome},
             {path :'/users',component: Users},
             {path :'/rights',component: Rights},
             {path :'/roles',component: Roles},
             {path :'/categories',component: Cate},
             {path :'/goods',component: GoodsList},
             { path: '/goods/add', component: Add },
             {path :'/params',component: Params},
             {path :'/orders',component: Orders},
             {path :'/Reports',component: Reports},
          ]
        },
      
         //404页面
         {path: '*',name: '/404',component: NotFound},
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to 将要访问的路径
  //from 代表从哪个路径跳转而来；
  //next()放行 next('/login') 强制跳转
  if(to.path==='/login')return next()
  //获取token
  const tokenStr=window.sessionStorage.getItem('token')
  if(!tokenStr)return next('login')
  next()
})
export default router
