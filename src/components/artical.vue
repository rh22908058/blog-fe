
<template>
    <div class="artical">
        <h3 class="title">{{article.title}}</h3> 
        <div class="info">
            <!--获取tags数组，取出name属性并拼接成一个字符串-->
            <span class="info-item">{{tagStr}}◈</span>
            <span class="info-item">{{article.createdAt|formatDate}}◈</span>
            <span class="info-item">浏览◈</span>
            <!--
            <router-link class="info-item" :to="`/article/${article.id}/edit`">修改◈</router-link>
            <md-button class="md-raised md-primary" @click="deleteArticle">删除</md-button>
            -->
            <span class="info-item">{{article.clickTimes}}</span>
        </div>
        <div class="content" v-html="subContent"></div>
        <!--子组件里的路由跳转也都使用router-link-->
        <!--router-link用模板字符串指定to，要绑定to并且值用引号包裹反引号-->
        <div @click="selectItem"><router-link class="todetail" :to="`/detail/${article.id}`"> | 查看文章 | </router-link></div>
    </div>
</template>
<script type="text/ecmascript-6">

import {formatDate} from '../commons/js/date'
import axios from 'axios'
import store from 'store'
    export default{
        created(){
        },
        props:{
            article:{
                type:Object
            }
        },
        computed:{
            tagStr(){
                if(this.article.tags){
                    return this.article.tags.map(i=>i.name).join(",")
                }         
            },
            subContent(){
                let str=this.article.content.slice(0,80)
                str+='...'
                return str
            }
        },
        methods:{
            /*
            deleteArticle(){
                axios.delete(`http://localhost:3000/api/article/${this.article.id}`).then(res=>{
                    //删除成功，给父组件发送delete事件
                    if(!res.data.err){
                        this.$emit('delete',this.article.id)
                    }
                })
            }
            */
            selectItem(){
                //localStorage.setItem("scrollTop",document.documentElement.scrollTop)
                store.set("scrolltop",document.documentElement.scrollTop||document.body.scrollTop)            
            }
        },
        /*添加时间过滤器*/
        filters:{
            formatDate(time){
                let date=new Date(time)
                /*为了便于其他组件使用，将时间格式化方法formatDate在common/js中定义,通用方法抽象成模块*/
                return formatDate(date,'yyyy-MM-dd hh:mm')
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .artical
        text-align left
        padding 20px 20px 30px 20px
        .title
            font-size 20px
            color #40759b
            font-weight bold
            line-height 1.1
            border-bottom 1px solid #d8e2eb
            padding-bottom 10px
        .info-item
            font-size 14px
        .content
            font-size 15px
            line-height 1.77
            color #333
            padding-top 10px  
        .detailcontent    
            text-align left   
        .todetail
            text-decoration none
            font-size 14px
            color #40759b
            float right
            margin -20px 0 0
            padding 15px 10px
</style>