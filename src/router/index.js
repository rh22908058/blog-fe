import Vue from 'vue'
import Router from 'vue-router'
/*
import mainContent from '@/components/mainContent'
import detailArtical from '@/components/detailArtical'
import about from '@/components/about'
*/
import mainContent from '../pages/mainContent'
import detailArtical from '../pages/detailArtical'
import articleEditor from '../components/articleEditor'
import about from '../pages/about'
import admin from '../pages/admin'
import signOut from '../pages/signOut'

Vue.use(Router)

let router=new Router({
    routes: [{
        path: '/',
        component: mainContent,
        name:'Home'
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
    linkActiveClass: 'active'
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