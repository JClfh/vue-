import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
//404
import  NotFound from '../views/404.vue'
import  Welcome from '../components/Welcome.vue'
import  Users from '../components/user/Users.vue'
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
             {path :'/users',component: Users}
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
