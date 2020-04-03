import Vue from 'vue'
import VueRouter from 'vue-router'
import homePage from '../views/Main.vue'
Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: Home
  // },
  {
    path:'/adminRegister',
    component: () => import('../views/adminRegister.vue')
  },
  {
    path: '/login',
    component:() => import('../views/login.vue')
  },
  {
    path: '/',
    name: 'homePage',
    component: homePage,
    // redirect: 'home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import ('../views/childViews/user')
      },
      {
        path: 'register/pending',
        name: 'registerPending',
        component:() => import ('../views/childViews/registerWait')
      },
      {
        path: 'register/done',
        name: 'registerDone',
        component: () => import ('../views/childViews/register'),
        props: true
      },
      {
        path: 'register/down',
        name: 'registerDown',
        component: () => import ('../views//childViews/registerdown')
      },
      {
        path: 'user/userList',
        name: 'userList',
        component: () => import ('../views/childViews/user'),
        props: true
      },
      {
        path: 'user/addAdmin',
        name: 'addAdmin',
        component: () => import ('../views/childViews/addAdmin'),
        props: true
      },
      {
        path: 'user/violator',
        name: 'violatorUser',
        component: () => import ('../views/childViews/violationUser'),
      },
      {
        path:'user/delete',
        name:'deleteUser',
        component:() => import ('../views//childViews/deleteUser')
      },
      {
        path: 'article/articleList',
        name: 'articleList',
        component: () => import ('../views/childViews/article'),
      },
      {
        path: 'article/newArticles',
        name: 'newArticles',
        component: () => import ('../views/childViews/newArticles'),
      },
      {
        path: 'article/deleteList',
        name:'deleteArticles',
        component: () => import ('../views//childViews/deleteArticles')
      },
      {
        path:'article/showstop',
        name:'showstop',
        component:() => import ('../views/childViews/showstop')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next) =>{
  if(to.path != '/login'){
    let token = sessionStorage.getItem('Authorization')
    if(!token){
      // console.log(to.path)
      // if(to.path === '/adminRegister'){
      //  return next('/adminRegister')
      // }
      if(to.path !== '/adminRegister'){
        next('/login')
      }
      else{
        next()
      }
      
    }
    else{
      next()
    }
  }
  else{
    next()
  }
  
})
export default router
