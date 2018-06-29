// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import VueRouter from 'vue-router'
import './assets/icon.css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import "./commons/stylus/icon.styl"
//全局注册下拉加载插件
import infiniteScroll from 'vue-infinite-scroll'

import axios from 'axios'
//在入口JS文件中全局设置axios的withCredentials为true，进行跨域请求时发送cookie
//因为前端是8080端口后端是3000端口，前端的登录请求存在跨域，axios默认跨域时不发送cookie
axios.defaults.withCredentials=true

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueMaterial)
Vue.use(infiniteScroll)

new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    router
})