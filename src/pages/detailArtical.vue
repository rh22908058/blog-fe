
<template>
    <div class="artical">
        <h3 class="title">{{article.title}}</h3> 
        <div class="info">
            <span class="info-item">{{tagStr}}◈</span>
            <span class="info-item">{{article.createdAt|formatDate}}◈</span>
            <span class="info-item">浏览</span>
            <span class="info-item">{{article.clickTimes}}次</span>
        </div>
        <p class="detailcontent" v-html="article.content"></p>
    </div>
</template>
<script type="text/ecmascript-6">
import axios from 'axios'
import {formatDate} from '../commons/js/date'
    export default{
        data(){
            return {
                article:{}
            }
        },
        computed:{
            tagStr(){
                if(this.article.tags){
                    return this.article.tags.map(i=>i.name).join(",")
                }         
            }
        },
        created(){
            //向后端3000端口请求指定一条article数据
            //vue-router组件的$route指令获取url相关对象，$route.params可以获取动态参数
            axios.get(`http://39.105.136.160:3000/api/article/${this.$route.params.id}`).then(res=>{
                if(!res.err){
                    //axios对数据又做了一层封装，需要res.data.data
                    this.article=res.data.data
                }else{
                    console.log(res.err)
                }
            })
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
        margin 10px 0 20px 0
        background #fff
        border-radius 4px
        box-shadow 1px 2px 3px #adc2d7
        border 1px solid #adc2d7
        .title
            font-size 20px
            text-align center
            font-weight bold
            line-height 1.1
        .info
            text-align center
            font-size 14px
        .detailcontent
            font-size 15px
            line-height 1.77
            color #333
            padding 10px
</style>