import Vue from 'vue'
import Router from 'vue-router'
/*
import mainContent from '@/components/mainContent'
import detailArtical from '@/components/detailArtical'
import about from '@/components/about'
*/
/*
import mainContent from '../pages/mainContent'
import detailArtical from '../pages/detailArtical'
import articleEditor from '../components/articleEditor'
import about from '../pages/about'
import admin from '../pages/admin'
import signOut from '../pages/signOut'
*/
const mainContent = (resolve) => {
  import('../pages/mainContent').then((module) => {
    resolve(module)
  })
}
const detailArtical = (resolve) => {
  import('../pages/detailArtical').then((module) => {
    resolve(module)
  })
}
const articleEditor = (resolve) => {
  import('../components/articleEditor').then((module) => {
    resolve(module)
  })
}
const signOut = (resolve) => {
  import('../pages/signOut').then((module) => {
    resolve(module)
  })
}
const about = (resolve) => {
  import('../pages/about').then((module) => {
    resolve(module)
  })
}
const admin = (resolve) => {
  import('../pages/admin').then((module) => {
    resolve(module)
  })
}


Vue.use(Router)

let router=new Router({
    //add
    mode:'history',
    routes: [{
        path: '/',
        component: mainContent,
        name:'Home',
        meta: {
            title: 'home',
            keepAlive: true
        }
    }, {
        path: '/detail/:id',
        component: detailArtical,
        name:'Detail'
    },
    //这里有一个优先级问题，如果先匹配到/detail/add就不会再匹配/detail/:id/edit
    {
        path: '/article/add',
        component: articleEditor,
        name:'Edit'
    },{
        path: '/article/:id/edit',
        component: articleEditor,
        name:'Edit'
    },
    {
        path: '/about',
        component: about
    },
    {
        path:'/admin',
        component:admin,
        name:'Admin'
    },
    {
        path: '/archive/:year/:month',
        component: mainContent,
        name:'Archive'
    },
    {
        path: '/tag/:id',
        component: mainContent,
        name:'Tag'
    },
    {
        path: '/sign-out',
        component: signOut,
        name:'signOut'
    }],
    linkActiveClass: 'active',
    //add
    scrollBehavior (to, from, savedPosition) {
        var pos=window.scrollY
        console.log(pos+'window')
        if (savedPosition) {
            return savedPosition
        } else {
            from.meta.savedPosition = document.documentElement.scrollTop
            console.log(from.meta.savedPosition+'scrollfrom')
            return { x: 0, y: to.meta.savedPosition || 0 }
        }
    }
})
/*全局路由钩子，当用户登录后(localstorage中保存登录信息)，才可以访问admin路由，否则禁止访问*/
/*这里的访问是指手动输入admin的URL*/
/*
router.beforeEach((to,from,next)=>{
    if(to.name==='Admin'){
        if(window.localStorage.getItem('userId')){
            next()
        }else{
            next(false)
        }
    }else{
        next()
    }
})
*/
export default router